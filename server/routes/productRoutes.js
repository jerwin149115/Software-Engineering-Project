const express = require('express');
const { getProduct, addProduct, updateProduct, deleteProduct, getProductById, upload } = require('../controllers/productController');
const router = express.Router();

router.get('/getProduct', getProduct);
router.get('/getProductById/:id', getProductById);
router.post('/addProduct', upload.single('image'), addProduct);
router.put('/updateProduct/:id', upload.single('image'), updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;
