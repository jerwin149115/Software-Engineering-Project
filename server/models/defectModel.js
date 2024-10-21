const mongoose = require('mongoose');
const { Schema } = mongoose;

const defectsSchema = new mongoose.Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity_defective: { type: Number, required: true }, 
    defect_reason: { type: String, required: true }, 
    detected_at: { type: Date, default: Date.now }, 
    remarks: { type: String, default: "" } 
});

module.exports = mongoose.model('Defects', defectsSchema);
