const express = require('express');
const { addCart, removeCartProduct, getCartProduct } = require('../controllers/CartController');
const router = express.Router({ mergeParams: true });
const {protect} = require('../middleware/auth');

router.route('/')
.post(protect  , addCart);
    
router.route('/:cartId')
.patch(protect , removeCartProduct);

router.route('/user/:userId')
.get(protect , getCartProduct)
   

module.exports = router;    