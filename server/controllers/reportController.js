const reportLogs = require('../models/reportLogs')

const getReportLogs = async(req, res) => {
    const { username } = req.query;

    try {
        const report = username ? await reportLogs.find({ username: { $regex: username, $options: 'i'} }) : await reportLogs.find();
        res.status(200).json(report);
    } catch (error) { 
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getReportLogs
}