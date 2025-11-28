const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/database');
const app = require('../app'); // app.js exports the express instance
const PriceHistory = require('../models/PriceHistory');

describe('/api/predict-down integration', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('returns heuristic prediction when ML service is offline', async () => {
    const productId = new mongoose.Types.ObjectId();
    const today = new Date();
    const pastDate = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);

    await PriceHistory.deleteMany({ productId });

    await PriceHistory.create({
      productId,
      date: pastDate,
      listing_price: 900,
    });
    await PriceHistory.create({
      productId,
      date: today,
      listing_price: 1000,
    });

    const res = await request(app).get(`/api/predict-down/${productId.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('probability');
    expect(res.body).toHaveProperty('will_go_down');
    expect(res.body).toHaveProperty('source');
  });
});


