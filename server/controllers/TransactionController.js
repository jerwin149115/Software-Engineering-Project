const Product = require('../models/productModel');
const Sales = require('../models/saleModel')
const Defects = require('../models/defectModel');
const ReportLogs = require('../models/reportLogs')

const getProductById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(401).json({ message: 'Product not found'});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching the product '});
    }
}

const sellProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found'});
    }

    if (product.quantity <= 0) {
        return res.status(400).json({ message: 'Product is out of stock' });
    }

    product.totalPrice = product.quantity * product.price;
    const remainingStockValue = product.totalPrice

    product.quantity -= 1;
    await product.save();

    const newSales = new Sales({
        product: product._id,
        quantity_sold: 1,
        sale_price: product.price,
        sold_at: Date.now(),
        remarks: '1 unit sold'
    });
    await newSales.save();

    const newLog = new ReportLogs({
        eventType: 'sale',
        teamId: req.user.teamId,
        username: req.user.username,
        timestamp: Date.now(),
        remarks: 'Sold 1 unit', 
    });
    await newLog.save();

    res.json({ message: 'Product Sold successfully', product, remainingStockValue})
  } catch (error) {
    res.status(500).json({ message: 'Error selling the product'})
  }
};


const markAsDefect = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found'});
        }

        if (product.quantity <= 0) {
            return res.status(400).json({ message: 'Product is out of stock' });
        }

        product.totalPrice = product.quantity * product.price;
        const remainingStockValue = product.totalPrice;

        product.quantity -= 1;
        await product.save();
        
        const newDefects = new Defects({
            product: product._id,
            quantity_defective: 1,
            defect_reason: 'default reason',
            remarks: '1 unit defect',
        });
        await newDefects.save();

        const newLog = new ReportLogs({
            eventType: 'defect',
            teamId: req.user.teamId,
            username: req.user.username,
            timestamp: Date.now(),
            remarks: 'Set 1 unit as defect', 
        });
        await newLog.save();
        res.json({ message: 'Product set defect successfully!', product, remainingStockValue})
    } catch (error) {
        res.status(500).json({ message: 'Error setting the defect product'})
    }
}

module.exports = {
    sellProduct,
    markAsDefect,
    getProductById,
}