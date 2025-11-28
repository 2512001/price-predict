const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = Schema({
    rating: {
        type: Number,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    comment : {
        type: String,
        maxLength : 500
    }
}, { timestamps: true });


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;