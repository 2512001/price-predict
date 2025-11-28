const express = require('express');
const axios = require('axios');
const PriceHistory = require('../models/PriceHistory');
const Prediction = require('../models/Prediction');

const router = express.Router();

// Configurable threshold, default 0.5
const DEFAULT_THRESHOLD = parseFloat(process.env.PRICE_DROP_THRESHOLD || '0.5');
const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || 'http://ml_service:8000/predict/down';

async function computeFeaturesForProduct(productId) {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000);

  const history = await PriceHistory.find({
    productId,
    date: { $gte: startDate, $lte: endDate },
  })
    .sort({ date: 1 })
    .lean();

  if (!history.length) {
    return null;
  }

  const closingPrices = history.map((h) => h.listing_price);
  const dates = history.map((h) => h.date);

  const current_price = closingPrices[closingPrices.length - 1];

  const rollingAvg = (windowDays) => {
    const cutoff = new Date(
      endDate.getTime() - windowDays * 24 * 60 * 60 * 1000
    );
    const window = history.filter((h) => h.date >= cutoff);
    if (!window.length) return null;
    return (
      window.reduce((sum, h) => sum + h.listing_price, 0) / window.length
    );
  };

  const avg7 = rollingAvg(7);
  const avg30 = rollingAvg(30);
  const avg90 = rollingAvg(90);

  const vol30 = (() => {
    const cutoff = new Date(
      endDate.getTime() - 30 * 24 * 60 * 60 * 1000
    );
    const window = history.filter((h) => h.date >= cutoff);
    if (window.length < 2) return null;
    const mean =
      window.reduce((sum, h) => sum + h.listing_price, 0) / window.length;
    const variance =
      window.reduce(
        (sum, h) => sum + Math.pow(h.listing_price - mean, 2),
        0
      ) / (window.length - 1);
    return Math.sqrt(variance);
  })();

  const linearSlope = (windowDays) => {
    const cutoff = new Date(
      endDate.getTime() - windowDays * 24 * 60 * 60 * 1000
    );
    const window = history.filter((h) => h.date >= cutoff);
    if (window.length < 2) return null;
    const xs = window.map((h) => h.date.getTime() / (1000 * 60 * 60 * 24));
    const ys = window.map((h) => h.listing_price);
    const n = xs.length;
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - meanX) * (ys[i] - meanY);
      den += Math.pow(xs[i] - meanX, 2);
    }
    if (!den) return 0;
    return num / den;
  };

  const slope30 = linearSlope(30);
  const slope90 = linearSlope(90);

  const price_change_30 = (() => {
    const cutoff = new Date(
      endDate.getTime() - 30 * 24 * 60 * 60 * 1000
    );
    const window = history.filter((h) => h.date >= cutoff);
    if (!window.length) return null;
    const first = window[0].listing_price;
    if (!first) return 0;
    return (current_price - first) / first;
  })();

  const latest = history[history.length - 1];

  const day_of_week = endDate.getUTCDay();
  const month = endDate.getUTCMonth() + 1;

  const days_since_release = latest.days_since_release ?? null;

  const storage = latest.storage ?? null;

  const conditionMap = {
    new: 4,
    like_new: 3,
    good: 2,
    fair: 1,
    poor: 0,
  };
  const condition_encoded = latest.condition
    ? conditionMap[latest.condition] ?? 0
    : 0;

  const sold_count_avg30 = (() => {
    const cutoff = new Date(
      endDate.getTime() - 30 * 24 * 60 * 60 * 1000
    );
    const window = history.filter((h) => h.date >= cutoff && h.sold_count);
    if (!window.length) return null;
    return (
      window.reduce((sum, h) => sum + (h.sold_count || 0), 0) / window.length
    );
  })();

  return {
    current_price,
    avg7,
    avg30,
    avg90,
    vol30,
    slope30,
    slope90,
    price_change_30,
    day_of_week,
    month,
    days_since_release,
    storage,
    condition_encoded,
    sold_count_avg30,
  };
}

function heuristicFallback(features, threshold) {
  const { current_price, avg30 } = features;
  if (!current_price || !avg30) {
    return {
      probability: 0.5,
      will_go_down: threshold <= 0.5,
    };
  }

  // Simple heuristic:
  // If current price is at least 3% above 30-day average, high chance to go down.
  const ratio = current_price / avg30;
  let probability;
  if (ratio >= 1.03) {
    probability = 0.8;
  } else if (ratio >= 1.0) {
    probability = 0.6;
  } else if (ratio >= 0.97) {
    probability = 0.4;
  } else {
    probability = 0.2;
  }

  return {
    probability,
    will_go_down: probability >= threshold,
  };
}

router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const threshold =
      req.query.threshold !== undefined
        ? parseFloat(req.query.threshold)
        : DEFAULT_THRESHOLD;

    const existing = await Prediction.findOne({ productId })
      .sort({ createdAt: -1 })
      .lean();

    if (existing && Date.now() - existing.createdAt.getTime() < 24 * 60 * 60 * 1000) {
      return res.json({
        productId,
        probability: existing.probability,
        will_go_down: existing.will_go_down,
        threshold: existing.threshold,
        modelVersion: existing.modelVersion,
        features: existing.features,
        source: 'cache',
      });
    }

    const features = await computeFeaturesForProduct(productId);
    if (!features) {
      return res.status(404).json({
        success: false,
        message: 'Not enough price history to compute features',
      });
    }

    let mlResponse = null;
    try {
      const { data } = await axios.post(ML_SERVICE_URL, {
        features,
        threshold,
      });
      mlResponse = data;
    } catch (err) {
      console.error('ML service error, falling back to heuristic:', err.message);
    }

    let probability;
    let will_go_down;
    let modelVersion;
    let top_features;

    if (mlResponse && mlResponse.success !== false) {
      probability = mlResponse.probability;
      will_go_down = mlResponse.will_go_down;
      modelVersion = mlResponse.modelVersion;
      top_features = mlResponse.top_features || [];
    } else {
      const heuristic = heuristicFallback(features, threshold);
      probability = heuristic.probability;
      will_go_down = heuristic.will_go_down;
      modelVersion = 'heuristic-v1';
      top_features = ['current_price', 'avg30'];
    }

    const saved = await Prediction.create({
      productId,
      probability,
      will_go_down,
      threshold,
      modelVersion,
      features,
    });

    return res.json({
      productId,
      probability,
      will_go_down,
      threshold,
      modelVersion,
      features,
      top_features,
      createdAt: saved.createdAt,
      source: mlResponse ? 'ml' : 'heuristic',
    });
  } catch (error) {
    console.error('predict-down error', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute prediction',
    });
  }
});

module.exports = router;


