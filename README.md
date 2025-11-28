## Price Drop Prediction Module

This project extends the existing MERN application with a complete price drop prediction pipeline (data import, feature engineering, ML model, microservice, backend route, frontend badge, cron jobs, and Docker setup).

### 1. Data Import

- Place your training CSV (e.g. `iphone_synthetic_prices.csv`) inside the `ml/` directory.
- Ensure it contains at least: `productId` or `sku`, `date`, `listing_price`, `storage`, `condition`, `ageDays` (or `days_since_release`), `month`, `day_of_week`, `sold_count`.
- Import historical prices into Mongo:

```bash
cd backend/..
MONGODB_URI="mongodb://localhost:27017/cashify" node scripts/import_price_history.js ml/iphone_synthetic_prices.csv
```

### 2. Train the Model

From the project root:

```bash
cd ml
pip install -r requirements.txt
python train_classifier.py
```

This will create `model.joblib`, `model_meta.json`, and `feature_config.json` in `ml/`.

You can also run weekly retraining via:

```bash
chmod +x cron/retrain_weekly.sh
./cron/retrain_weekly.sh
```

### 3. Database Setup

#### PostgreSQL

The synchronous prediction endpoint requires PostgreSQL. Set up a PostgreSQL database and run the migration:

```bash
psql $DATABASE_URL -f backend/migrations/001_create_predictions_table.sql
```

Or manually create the `predictions` table (see migration file for schema).

#### MongoDB

Run a local MongoDB instance (or use your existing one) and set `MONGODB_URI` in `.env` for the backend.

### 4. Environment Variables

Create a `.env` file in the `backend/` directory with:

```env
# MongoDB (existing)
MONGODB_URI=mongodb://localhost:27017/cashify

# PostgreSQL (new - required for /api/v1/predict)
DATABASE_URL=postgresql://user:password@localhost:5432/predictions
DATABASE_SSL=false

# ML Service
ML_SERVICE_URL=http://localhost:8000/predict/timeseries

# Model Configuration
MODEL_VERSION=v1.0
MODEL_TIMEOUT_SECONDS=3

# Logging
LOG_LEVEL=info
```

### 5. Start Services (Local)

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### ML Service

```bash
cd ml
uvicorn service:app --host 0.0.0.0 --port 8000
```

Ensure `ML_SERVICE_URL` in backend `.env` points to `http://localhost:8000/predict/timeseries` for time-series predictions.

#### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend will talk to the backend at `http://localhost:3000/api` (configured in `client/src/Api/api.js`).

### 6. Docker Setup

To run Mongo, backend, ML service, and frontend via Docker:

```bash
docker-compose up --build
```

This will expose:

- Backend: `http://localhost:3000`
- ML Service: `http://localhost:8000`
- Frontend: `http://localhost:5173`

### 7. Cron Jobs

- **Daily snapshot** (`cron/daily_snapshot.js`): records current official prices and updates rolling features.

Example (Linux/Mac crontab):

```bash
0 2 * * * cd /path/to/cashify && MONGODB_URI="mongodb://localhost:27017/cashify" node cron/daily_snapshot.js >> daily_snapshot.log 2>&1
```

- **Weekly retrain** (`cron/retrain_weekly.sh`):

```bash
0 3 * * 0 cd /path/to/cashify && ./cron/retrain_weekly.sh >> retrain.log 2>&1
```

### 6. Using the Prediction API

#### Synchronous Price Prediction (Time-Series)

**POST /api/v1/predict**

Synchronous endpoint that returns time-series price predictions for the next N days.

**Request:**
```json
{
  "request_id": "optional-uuid",
  "user_id": "string",
  "product_id": "string",
  "features": {
    "recent_prices": [100.0, 101.5, 102.0]
  },
  "horizon_days": 7
}
```

**Response 200:**
```json
{
  "request_id": "uuid-123",
  "model_version": "v1.0",
  "predicted_at": "2025-11-28T12:34:56Z",
  "horizon_days": 7,
  "predictions": [
    {"date": "2025-11-29", "predicted_price": 103.1},
    {"date": "2025-11-30", "predicted_price": 104.2}
  ],
  "confidence": 0.87,
  "latency_ms": 123
}
```

**Error Responses:**
- `400`: Invalid input (missing required fields, invalid horizon_days, etc.)
- `502`: Model service error
- `504`: Model timeout (exceeds MODEL_TIMEOUT_SECONDS)

**Example curl:**
```bash
curl -X POST http://localhost:3000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "sku-001",
    "user_id": "user-123",
    "features": {
      "recent_prices": [100, 101, 99]
    },
    "horizon_days": 7
  }'
```

**Health & Metrics:**
- `GET /health` - Health check endpoint
- `GET /metrics` - Prometheus metrics (prediction_latency_ms histogram, predictions_total counter)

#### Binary Price Drop Prediction

- **ML service**: `POST /predict/down`
  - Request body: `{ "features": { ... }, "threshold": 0.5 }`
  - Response fields: `probability`, `will_go_down`, `threshold`, `modelVersion`, `confidence`, `top_features`, `feature_vector`.

- **Backend**: `GET /api/predict-down/:productId`
  - Computes the last-365-day feature vector from `PriceHistory`, calls ML service, falls back to heuristic when ML is offline, caches results in `Predictions` collection, and returns JSON to the frontend.

### 8. Frontend Components

#### ProductCard with Price Prediction

The `ProductCard` component now includes a "Predict Price" button that:
- Calls `/api/v1/predict` when clicked
- Shows a loading spinner ("Predicting…") while waiting
- Displays predictions in a Chart.js line chart
- Shows model version and latency information
- Handles errors with retry functionality

The chart overlays predicted prices and can display historical prices if available.

### 9. Frontend Badge

The `PredictedDownBadge` React component (`client/src/components/PredictedDownBadge.jsx`) is used inside `ProductDetails` and:

- Calls `/api/predict-down/:productId`.
- Shows probability and a label: **Likely to go down** or **Likely to stay stable**.
- Displays the top 2 contributing features.

### 10. Tests

- **Python (ML)**:

```bash
cd ml
pytest
```

- **Node backend integration**:

```bash
cd backend
npm test
```

This runs:
- `/api/predict-down` integration test (heuristic fallback when ML is offline)
- `/api/v1/predict` unit tests (success, invalid input, timeout, model error)
- Health and metrics endpoint tests

**Frontend tests:**
```bash
cd client
npm test
```

Tests cover ProductCard component behavior including loading states, chart rendering, and error handling.


