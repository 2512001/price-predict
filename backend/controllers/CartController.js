const cartModel = require('../models/Cart');



exports.getCartProduct = async (req, res) => {
    try {

        let { userId } = req.params;

        const cartData = await cartModel.findOne(
            { userId },
        ).populate('items.productId').lean(); // Optional: returns plain JS object


        res.status(200).json({ cartData });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

exports.addCart = async (req, res) => {
    try {
        let { productId } = req.body;
        const userId = req.user._id;

        let cart = await cartModel.findOne({ userId });

       
        if (cart) {
            let item = cart.items.find((data) => data.productId.toString() === productId);
            if (item) {
                item.quantity += 1;
                await cart.save();
                return res.status(200).json({ message: 'Product quantity has been increased' });
            } else {
                cart.items.push({ productId });
                const cartData = await cart.save();
                return res.status(201).json({ message: 'Product is added to the cart', cartData });
            }
        } else {
            const newCart = new cartModel({
                userId,
                items: [{ productId }]
            });
           const cartData =   await newCart.save();
           
            return res.status(201).json({ message: 'Product is added to the cart' , cartData });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};



exports.removeCartProduct = async (req, res) => {
    try {
        
        let { cartId } = req.params;
        let { productId } = req.body;


        const data = await cartModel.updateOne(
            { _id: cartId },
            { $pull: { items: { productId } } }
        );

        
        res.status(200).json({ message: 'Product has been removed from the cart', data });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};
