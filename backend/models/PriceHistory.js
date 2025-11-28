const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sku: {
      type: String,
      required: false,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    listing_price: {
      type: Number,
      required: true,
    },
    storage: {
      type: Number,
      required: false,
    },
    condition: {
      type: String,
      required: false,
      enum: ['new', 'like_new', 'good', 'fair', 'poor'],
    },
    // Pre-computed rolling features (optional but useful for fast inference)
    avg7: Number,
    avg30: Number,
    avg90: Number,
    vol30: Number,
    slope30: Number,
    slope90: Number,
    price_change_30: Number,
    day_of_week: Number,
    month: Number,
    days_since_release: Number,
    sold_count: Number,
    sold_count_avg30: Number,
  },
  { timestamps: true }
);

priceHistorySchema.index({ productId: 1, date: 1 });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);


