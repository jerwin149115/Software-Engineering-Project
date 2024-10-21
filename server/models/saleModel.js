const mongoose = require('mongoose');
const { Schema } = mongoose;

const salesSchema = new mongoose.Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity_sold: { type: Number, required: true },  
    sale_price: { type: Number, required: true }, 
    sold_at: { type: Date, default: Date.now },  
    remarks: { type: String, default: "" }  
});

module.exports = mongoose.model('Sales', salesSchema);
