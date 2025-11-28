const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    probability: {
      type: Number,
      required: true,
    },
    will_go_down: {
      type: Boolean,
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
      default: 0.5,
    },
    modelVersion: {
      type: String,
      required: true,
    },
    features: {
      type: Object,
      required: true,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

predictionSchema.index({ productId: 1, modelVersion: 1 });

module.exports = mongoose.model('Prediction', predictionSchema);


