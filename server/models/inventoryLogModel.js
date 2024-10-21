const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventoryLogSchema = new mongoose.Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, 
    change_type: { 
        type: String, 
        enum: ['sale', 'defect', 'manual'], 
        required: true 
    },
    quantity_change: { type: Number, required: true }, 
    timestamp: { type: Date, default: Date.now }, 
    remarks: { type: String, default: "" }  
});

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
