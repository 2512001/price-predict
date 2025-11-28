const express = require('express');
const { addReview, getReview, deleteReview, getReviews } = require('../controllers/ReviewController');
const {protect} = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

router.route('/')
    .post(addReview)
    .delete(deleteReview)
    .get(getReviews);


router.route('/:reviewId')
.delete(deleteReview);    

module.exports = router;    