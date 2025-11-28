const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getPageCount
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const { storage, imageStorage } = require('../config/cloudinary');
const validationMiddleware = require('../middleware/validation');
//const { productValidationSchema } = require('../config/validation');

const uploads = multer({ storage: storage });

// Public routes - accessible to all users
router.route('/')
    .get(getProducts);

router.route('/pageCount')
    .get(getPageCount);

router.route('/:id')
    .get(getProduct);

// Admin routes - only accessible to admin users
router.route('/')
    .post(
        protect,
        isAdmin,
        uploads.fields([
            { name: 'image', maxCount: 3 },
            { name: 'video', maxCount: 1 }
        ]
        ),
        //    validationMiddleware(productValidationSchema),
        createProduct
    );
router.route('/:id')
    .put(protect, isAdmin, updateProduct)
    .delete(protect, isAdmin, deleteProduct);


//reveiw router    
const reviewRouter = require('./ReviewRoutes');
router.use('/:productId/reviews', reviewRouter);

module.exports = router; 