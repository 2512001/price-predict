import React, { useState } from 'react';
import { predictPrice } from '../Api/api';
import { toast } from 'react-toastify';
import PricePredictionChart from '../components/PricePredictionChart';

// Sample data examples
const SAMPLE_DATA_SETS = [
  {
    name: 'iPhone 15 Pro - Rising Trend',
    data: {
      product_id: 'iphone-15-pro-256gb',
      user_id: 'user-001',
      features: {
        recent_prices: [85000, 87000, 89000, 91000, 93000]
      },
      horizon_days: 7
    }
  },
  {
    name: 'iPhone 14 - Stable Prices',
    data: {
      product_id: 'iphone-14-128gb',
      user_id: 'user-002',
      features: {
        recent_prices: [65000, 65200, 64800, 65000, 65100]
      },
      horizon_days: 7
    }
  },
  {
    name: 'iPhone 13 - Declining Trend',
    data: {
      product_id: 'iphone-13-256gb',
      user_id: 'user-003',
      features: {
        recent_prices: [55000, 54000, 53000, 52000, 51000]
      },
      horizon_days: 7
    }
  },
  {
    name: 'iPhone 12 - Volatile Prices',
    data: {
      product_id: 'iphone-12-128gb',
      user_id: 'user-004',
      features: {
        recent_prices: [45000, 47000, 44000, 46000, 45000]
      },
      horizon_days: 7
    }
  }
];

const TestPrediction = () => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);
  const [testData, setTestData] = useState({
    product_id: 'test-product-123',
    user_id: 'test-user-123',
    features: {
      recent_prices: [100, 101, 99]
    },
    horizon_days: 7
  });

  const handlePredict = async () => {
    setIsPredicting(true);
    setError(null);
    setPredictionData(null);

    try {
      console.log('Calling predictPrice with:', testData);
      const response = await predictPrice(testData);
      console.log('Response received:', response);
      setPredictionData(response);
      toast.success('Prediction successful!');
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Failed to predict price');
      toast.error(err.message || 'Failed to predict price');
    } finally {
      setIsPredicting(false);
    }
  };

  const loadSampleData = (sample) => {
    setTestData(sample.data);
    setError(null);
    setPredictionData(null);
    toast.info(`Loaded: ${sample.name}`);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Price Prediction API Test</h1>
      
      {/* Sample Data Section */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9' }}>
        <h2 style={{ marginTop: 0 }}>📊 Sample Data Sets</h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>Click any sample to load it, then click "Test Predict Price API"</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {SAMPLE_DATA_SETS.map((sample, index) => (
            <button
              key={index}
              onClick={() => loadSampleData(sample)}
              style={{
                padding: '1rem',
                background: 'white',
                border: '2px solid #2196f3',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'left'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e3f2fd';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#1976d2' }}>
                {sample.name}
              </strong>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                <div>Prices: ₹{sample.data.features.recent_prices.map(p => p.toLocaleString()).join(', ')}</div>
                <div>Days: {sample.data.horizon_days}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Test Parameters</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label>Product ID: </label>
          <input
            type="text"
            value={testData.product_id}
            onChange={(e) => setTestData({ ...testData, product_id: e.target.value })}
            style={{ padding: '8px', width: '300px', marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>User ID: </label>
          <input
            type="text"
            value={testData.user_id}
            onChange={(e) => setTestData({ ...testData, user_id: e.target.value })}
            style={{ padding: '8px', width: '300px', marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Recent Prices (comma-separated): </label>
          <input
            type="text"
            value={testData.features.recent_prices.join(', ')}
            onChange={(e) => setTestData({
              ...testData,
              features: {
                ...testData.features,
                recent_prices: e.target.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
              }
            })}
            placeholder="e.g., 100, 101, 99, 102"
            style={{ padding: '8px', width: '400px', marginLeft: '10px' }}
          />
          <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px', marginLeft: '120px' }}>
            Current: [{testData.features.recent_prices.map(p => `₹${p.toLocaleString()}`).join(', ')}]
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Horizon Days: </label>
          <input
            type="number"
            value={testData.horizon_days}
            onChange={(e) => setTestData({ ...testData, horizon_days: parseInt(e.target.value) || 7 })}
            style={{ padding: '8px', width: '100px', marginLeft: '10px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={handlePredict}
          disabled={isPredicting}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isPredicting ? 'not-allowed' : 'pointer',
            opacity: isPredicting ? 0.7 : 1,
            boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            if (!isPredicting) {
              e.target.style.backgroundColor = '#218838';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseOut={(e) => {
            if (!isPredicting) {
              e.target.style.backgroundColor = '#28a745';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {isPredicting ? '⏳ Predicting...' : '🚀 Test Predict Price API'}
        </button>
        
        <button
          onClick={() => {
            setError(null);
            setPredictionData(null);
            toast.info('Cleared results');
          }}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {predictionData && (
        <div>
          <h2>✅ Prediction Results</h2>
          <div style={{ marginBottom: '1rem', padding: '1.5rem', background: '#d4edda', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <strong style={{ color: '#155724' }}>Request ID:</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{predictionData.request_id}</div>
              </div>
              <div>
                <strong style={{ color: '#155724' }}>Model Version:</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{predictionData.model_version}</div>
              </div>
              <div>
                <strong style={{ color: '#155724' }}>Predicted At:</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(predictionData.predicted_at).toLocaleString()}</div>
              </div>
              <div>
                <strong style={{ color: '#155724' }}>Horizon Days:</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{predictionData.horizon_days} days</div>
              </div>
              <div>
                <strong style={{ color: '#155724' }}>Confidence:</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{(predictionData.confidence * 100).toFixed(1)}%</div>
              </div>
              <div>
                <strong style={{ color: '#155724' }}>Latency:</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{predictionData.latency_ms}ms</div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '6px' }}>
              <strong style={{ color: '#155724' }}>Predictions ({predictionData.predictions?.length || 0} days):</strong>
              
              {/* Trend Analysis */}
              {predictionData.predictions && predictionData.predictions.length > 0 && (() => {
                const firstPrice = predictionData.predictions[0].predicted_price;
                const lastPrice = predictionData.predictions[predictionData.predictions.length - 1].predicted_price;
                const priceChange = lastPrice - firstPrice;
                const percentChange = ((priceChange / firstPrice) * 100).toFixed(2);
                const isRising = priceChange > 0;
                const avgDailyChange = priceChange / (predictionData.predictions.length - 1);
                
                return (
                  <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: isRising ? '#fff3cd' : '#f8d7da', borderRadius: '6px', border: `1px solid ${isRising ? '#ffc107' : '#dc3545'}` }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                      <div>
                        <strong>Trend:</strong> <span style={{ color: isRising ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                          {isRising ? '📈 Rising' : '📉 Declining'}
                        </span>
                      </div>
                      <div>
                        <strong>Price Change:</strong> <span style={{ color: isRising ? '#28a745' : '#dc3545' }}>
                          {isRising ? '+' : ''}₹{Math.abs(priceChange).toLocaleString()} ({isRising ? '+' : ''}{percentChange}%)
                        </span>
                      </div>
                      <div>
                        <strong>Avg Daily:</strong> ₹{Math.abs(avgDailyChange).toFixed(2)}
                      </div>
                      <div>
                        <strong>Range:</strong> ₹{Math.min(...predictionData.predictions.map(p => p.predicted_price)).toLocaleString()} - ₹{Math.max(...predictionData.predictions.map(p => p.predicted_price)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })()}
              
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', maxHeight: '150px', overflowY: 'auto' }}>
                {predictionData.predictions?.slice(0, 10).map((p, i) => (
                  <div key={i} style={{ padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{p.date}:</span>
                    <strong>₹{p.predicted_price.toLocaleString()}</strong>
                  </div>
                ))}
                {predictionData.predictions?.length > 10 && (
                  <div style={{ color: '#666', fontStyle: 'italic', padding: '4px 0' }}>
                    ... and {predictionData.predictions.length - 10} more days (see chart for full details)
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <PricePredictionChart
              predictions={predictionData.predictions || []}
              historicalPrices={null}
              modelVersion={predictionData.model_version}
              latencyMs={predictionData.latency_ms}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPrediction;

