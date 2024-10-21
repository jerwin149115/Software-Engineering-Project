const Product = require('../models/productModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.originalname}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File is not an image'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
});

const getProduct = async (req, res) => {
    const { name } = req.query;
    try {
        const matchCondition = name ? { name: { $regex: name, $options: 'i' } } : {};

        const products = await Product.aggregate([
            { $match: matchCondition },
            {
                $lookup: {
                    from: 'sales',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'sales'
                }
            },
            {
                $addFields: {
                    quantity_sold: { $sum: '$sales.quantity_sold' },
                }
            },
            {
                $lookup: {
                    from: 'defects',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'defects'
                }
            },
            {
                $addFields: {
                    quantity_defective: { $sum: '$defects.quantity_defective' }
                }
            },
            {
                $project: {
                    sales: 0,
                    defects: 0
                }
            }
        ]);

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: error.message });
    }
};

const addProduct = async (req, res) => {
    const { name, description, price, quantity, inStock = false, status = 'available' } = req.body;
    const imageFile = req.file;

    if (!name || !description || !price || !quantity || !imageFile) {
        return res.status(400).json({ message: 'All fields including an image file are required' });
    }

    try {
        const parsedPrice = parseFloat(price);
        const parsedQuantity = parseInt(quantity, 10);

        if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
            return res.status(400).json({ message: 'Price and quantity must be valid numbers' });
        }

        const totalPrice = parsedQuantity * parsedPrice;
        const isInStock = parsedQuantity > 0;

        const newProduct = await Product.create({
            name,
            description,
            price: parsedPrice,
            quantity: parsedQuantity,
            inStock: isInStock,
            status,
            totalPrice,
            image: imageFile.path.replace(/\\/g, '/'),
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity, inStock = false, status = 'available' } = req.body;
    const image = req.file;

    try {
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (image && product.image) {
            const oldImagePath = path.join(__dirname, '..', product.image);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error('Error deleting old image:', err);
            });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price ? parseFloat(price) : product.price;
        product.quantity = quantity ? parseInt(quantity, 10) : product.quantity;
        product.inStock = inStock;
        product.status = status;
        if (image) product.image = image.path.replace(/\\/g, '/');

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.image) {
            const imagePath = path.join(__dirname, '..', product.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    upload,
};
