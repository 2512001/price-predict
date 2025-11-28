const Order = require('../models/Order');
const Product = require('../models/Product');
const razorpay = require('razorpay');
const cartModel = require('../models/Cart')

const razorpayIntance = new razorpay({
    key_id: process.env.Test_Key_ID,
    key_secret: process.env.Test_Key_Secret
});


const crypto = require('crypto');
const createPayment = async (totalAmount) => {

    const razorpayOptions = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`
    }

    return await razorpayIntance.orders.create(razorpayOptions);

}

// Payment verification API
exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.Test_Key_Secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: "Signature mismatch" });
    }
};



// Create new order
exports.createOrder = async (req, res) => {
    try {

        const { items, shippingAddress, paymentMethod } = req.body;


        // Check stock and calculate total price
        let totalAmount = 0;
        const orderItems = [];



        for (const item of items) {
            const product = await Product.findById(item.product).select('price name _id');

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }

            totalAmount += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            product.stock -= item.quantity;
            await product.save({ validateBeforeSave: false });
        };
        const productsToRemove = items.map(i => i.product);


        await cartModel.findOneAndUpdate({ userId: req.user._id }, { $pull: { items: { productId: { $in: productsToRemove } } } })

        if (paymentMethod === 'Razorpay') {
            
            const razorpayOrder = await createPayment(totalAmount);

            await Order.create({
                user: req.user._id,
                items: orderItems,
                totalAmount,
                shippingAddress,
                paymentMethod
            });




            return res.status(201).json({
                success: true,
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                message: "order created successfully",
                paymentMethod
            });
        }
        else {

            await Order.create({
                user: req.user._id,
                items: orderItems,
                totalAmount,
                shippingAddress,
                paymentMethod
            });


            return res.status(201).json({
                success: true,
                message: "order created successfully",
                paymentMethod
            });

        }


    } catch (error) {
        console.log('error handle triggered');
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Get orders
exports.getOrders = async (req, res) => {
    try {
        let query = {};


        if (req.user.role !== 'admin') {
            query.user = req.user._id;
        }


        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.product', 'name price images');


        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get single order
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to access this order' });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // only customer
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only cancel your own orders'
            });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending orders can be cancelled'
            });
        }

        order.status = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 