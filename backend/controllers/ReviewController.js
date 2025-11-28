const reviewModel = require('../models/Review');
const ProductModel = require('../models/Product');
const mongoose = require('mongoose');
module.exports.addReview = async (req, res) => {
    try {

        let { productId } = req.params;
        

        let { userId, comment, rating } = req.body;

        //query var
        let query = { productId, userId };
        if (comment) query.comment = comment;
        if (rating) query.rating = rating;


        //product 
        const product = await ProductModel.findById(productId);
        

        if (!product) {
            return res.status(401).json({ message: 'product did not found' });
        }


        const newReview = new reviewModel(query);
        await newReview.save();

        //geting average rating 
        const [{ averageRating, TotalReview }] = await reviewModel.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: '$rating'
                    },
                    TotalReview: {
                        $sum: 1
                    }
                }
            }
        ]);


        //  adding to product average rating
        const cleanRating = Number(averageRating.toFixed(1)); // e.g., 4.2

        product.averageRating = cleanRating;
        product.TotalReview = TotalReview;
        const products = await product.save({ validateBeforeSave: false });

        res.status(201).json({ success: true, products, message: "review added to the system", });

    } catch (error) {
        console.log(error.message);
    }
}

module.exports.getReviews = async (req, res) => {
    try {   
        console.log('triggred reviews');
             
        let { page = 1, limit = 4 } = req.query;
        limit = 4;
        let { productId } = req.params;
        

        const nextpage = (page - 1) * limit;


        let reviews = await reviewModel.find({ productId }).populate('userId', 'name profileImage')
            .sort({ createdAt: -1 })
            .skip(nextpage)
            .limit(limit);

                

        let totalReview = await reviewModel.countDocuments({ productId });
        const totalPage = Math.ceil(totalReview / limit);

        res.status(200).json({ totalReview, totalPage, reviews });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.deleteReview = async (req, res) => {
    try {
        let { productId, reviewId } = req.params;
        let { userId } = req.user.id;
        let query = { _id: reviewId, productId, userId };
        await reviewModel.findOneAndDelete(query);
        res.status(200).json({ message: 'reveiw deleted successfully' });
    } catch (error) {
        console.log(error.message);
    }
}
