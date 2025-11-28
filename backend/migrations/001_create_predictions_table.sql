-- Migration: Create predictions table
-- Run this with: psql $DATABASE_URL -f backend/migrations/001_create_predictions_table.sql

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
);

CREATE INDEX IF NOT EXISTS idx_predictions_request_id ON predictions(request_id);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_product_id ON predictions(product_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at);




