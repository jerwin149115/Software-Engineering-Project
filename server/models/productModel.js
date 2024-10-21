const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "No description provided" },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    totalPrice: { type: Number, default: 0},
    image: { type: String },
    status: {
        type: String,
        enum: ['available', 'sold_out', 'defective'],
        default: 'available'
    }
}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);
