const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportLogsSchema = new mongoose.Schema({
    eventType: { type: String, enum: ['login', 'sale', 'defect', 'request', 'logout'], required: true },
    username: { type: String, ref: 'Team', required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    timestamp: { type: Date, default: Date.now},
    remarks: { type: String, default: 'No Remarks'},
    details: { type: Object }
})

module.exports = mongoose.model('Reports', reportLogsSchema)
