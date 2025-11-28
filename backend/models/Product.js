const { required } = require('joi');
const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
    key: {
        type: String,
        maxLength: 50,
        required: true
    },
    value: {
        type: String,
        maxLength: 200,
        required: true
    }
}, { _id: false })

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true,
        maxLength: 100
    },
    // Optional SKU used for mapping to external price history
    sku: {
        type: String,
        unique: false,
        sparse: true,
        trim: true,
    },
    storage: {
        type: Number,
        required: [true, 'Please provide storage'],
    },
    color: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxLength: 500
    },
    averageRating: {
        type: Number,
        default: 0
    },
    TotalReview: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        min: [1, 'Price cannot be negative']
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative']
    },
    category: {
        type: String,
        required: true,
        enum: ['mobile', 'electronics']
    },
    images: [{
        type: String,
    }],
    video: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    features: {
        type: [String],
        validate: {
            validator: arrayLimit,
            message: 'Features array cannot exceed 10 items'
        }
    },
    specifications: {
        type: [specificationSchema],
        validate: {
            validator: function (val) {
                return val.length <= 6;
            },
            message: 'Specifications cannot exceed 6 items'
        }
    }

}, { timestamps: true });


function arrayLimit(val) {
    return val.length <= 10;
}
// productSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();e
// });

// Create index for better search performance
productSchema.index({ name: 'text', description: 'text', category: 'text' });
module.exports = mongoose.model('Product', productSchema);