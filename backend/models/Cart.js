const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required :  true
    },
    quantity: {
        type: Number,
        min: 1,
        max : 2,
        default: 1
    }
}, { _id: false });

const cartSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    items: [itemSchema]
}, { timestamps: true });


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;