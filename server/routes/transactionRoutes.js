const express = require('express');
const { sellProduct, markAsDefect, getProductById } = require('../controllers/TransactionController')
const auth = require('../middleware/teamJWTMiddleware')
const router = express.Router();

router.get('/getProductById/:id', auth, getProductById)
router.put('/sellProduct/:id', auth, sellProduct);
router.put('/markAsDefect/:id', auth, markAsDefect)


module.exports = router;
