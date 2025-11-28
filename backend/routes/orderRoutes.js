const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrder,
    cancelOrder,
    verifyPayment
} = require('../controllers/orderController');
const { protect , isCustomer } = require('../middleware/auth');
const {orderValidationSchema} = require('../config/validation');
const validationMiddleware = require('../middleware/validation');

router.route('/')
    .get(protect, getOrders)
    .post(protect , createOrder);


router.post('/payment/verify' , verifyPayment)    

router.route('/:id')
    .get(protect, getOrder);

router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router; 