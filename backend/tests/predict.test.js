const request = require('supertest');
const app = require('../app');
const { getPool } = require('../config/postgres');
const axios = require('axios');

// Mock axios for ML service calls
jest.mock('axios');

describe('POST /api/v1/predict', () => {
  let pool;

  beforeAll(async () => {
    pool = getPool();
    // Ensure test database is set up
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS predictions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          request_id TEXT,
          user_id TEXT,
          product_id TEXT,
          model_version TEXT,
          input JSONB,
          predictions JSONB,
          confidence NUMERIC,
          latency_ms INT,
          status TEXT,
          created_at TIMESTAMPTZ DEFAULT now()
        )
      `);
    } catch (error) {
      // Table might already exist
      console.log('Table creation skipped:', error.message);
    }
  });

  afterEach(async () => {
    // Clean up test data
    try {
      await pool.query("DELETE FROM predictions WHERE request_id LIKE 'test-%'");
    } catch (error) {
      // Ignore cleanup errors
    }
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (pool) {
      await pool.end();
    }
  });

  describe('Success case', () => {
    it('should return predictions successfully', async () => {
      const mockPredictions = [
        { date: '2025-11-29', predicted_price: 103.1 },
        { date: '2025-11-30', predicted_price: 104.2 },
      ];

      // Mock ML service response
      axios.post.mockResolvedValueOnce({
        data: {
          predictions: mockPredictions,
        },
      });

      const response = await request(app)
        .post('/api/v1/predict')
        .send({
          request_id: 'test-success-123',
          user_id: 'user-123',
          product_id: 'product-123',
          features: {
            recent_prices: [100.0, 101.5, 102.0],
          },
          horizon_days: 7,
        })
        .expect(200);

      expect(response.body).toHaveProperty('request_id');
      expect(response.body).toHaveProperty('model_version');
      expect(response.body).toHaveProperty('predicted_at');
      expect(response.body).toHaveProperty('horizon_days', 7);
      expect(response.body).toHaveProperty('predictions');
      expect(response.body).toHaveProperty('latency_ms');
      expect(Array.isArray(response.body.predictions)).toBe(true);
      expect(response.body.predictions.length).toBeGreaterThan(0);

      // Verify data was saved to DB
      const dbResult = await pool.query(
        "SELECT * FROM predictions WHERE request_id = 'test-success-123'"
      );
      expect(dbResult.rows.length).toBe(1);
      expect(dbResult.rows[0].status).toBe('success');
    });
  });

  describe('Invalid input', () => {
    it('should return 400 for missing product_id', async () => {
      const response = await request(app)
        .post('/api/v1/predict')
        .send({
          user_id: 'user-123',
          features: { recent_prices: [100, 101] },
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid input');
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for missing user_id', async () => {
      const response = await request(app)
        .post('/api/v1/predict')
        .send({
          product_id: 'product-123',
          features: { recent_prices: [100, 101] },
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for invalid horizon_days', async () => {
      const response = await request(app)
        .post('/api/v1/predict')
        .send({
          product_id: 'product-123',
          user_id: 'user-123',
          features: { recent_prices: [100, 101] },
          horizon_days: 500, // Invalid: > 365
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for invalid features', async () => {
      const response = await request(app)
        .post('/api/v1/predict')
        .send({
          product_id: 'product-123',
          user_id: 'user-123',
          features: 'not-an-object',
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Model timeout', () => {
    it('should return 504 when model exceeds timeout', async () => {
      // Mock axios to delay response beyond timeout
      axios.post.mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: { predictions: [] } });
          }, 5000); // Longer than default 3s timeout
        });
      });

      const response = await request(app)
        .post('/api/v1/predict')
        .send({
          request_id: 'test-timeout-123',
          user_id: 'user-123',
          product_id: 'product-123',
          features: {
            recent_prices: [100.0, 101.5, 102.0],
          },
          horizon_days: 7,
        })
        .expect(504);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('timeout');

      // Verify timeout was saved to DB
      const dbResult = await pool.query(
        "SELECT * FROM predictions WHERE request_id = 'test-timeout-123'"
      );
      expect(dbResult.rows.length).toBe(1);
      expect(dbResult.rows[0].status).toBe('timeout');
    });
  });

  describe('Model error', () => {
    it('should return 502 when model service fails', async () => {
      // Mock axios to throw an error
      axios.post.mockRejectedValueOnce(new Error('Model service unavailable'));

      const response = await request(app)
        .post('/api/v1/predict')
        .send({
          request_id: 'test-error-123',
          user_id: 'user-123',
          product_id: 'product-123',
          features: {
            recent_prices: [100.0, 101.5, 102.0],
          },
          horizon_days: 7,
        })
        .expect(502);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');

      // Verify error was saved to DB
      const dbResult = await pool.query(
        "SELECT * FROM predictions WHERE request_id = 'test-error-123'"
      );
      expect(dbResult.rows.length).toBe(1);
      expect(dbResult.rows[0].status).toBe('error');
    });
  });
});

describe('GET /health', () => {
  it('should return 200 when database is connected', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('database', 'connected');
  });
});

describe('GET /metrics', () => {
  it('should return Prometheus metrics', async () => {
    const response = await request(app).get('/metrics').expect(200);

    expect(response.text).toContain('prediction_latency_ms');
    expect(response.text).toContain('predictions_total');
  });
});




