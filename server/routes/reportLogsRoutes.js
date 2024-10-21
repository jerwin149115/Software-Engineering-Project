const express = require('express')
const { getReportLogs} = require('../controllers/reportController')
const router = express.Router();

router.get('/getReportLogs', getReportLogs)

module.exports = router;