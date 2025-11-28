import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PricePredictionChart = ({
  predictions,
  historicalPrices,
  modelVersion,
  latencyMs,
}) => {
  // --- 1. Basic validation for predictions ---
  if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
    console.error('PricePredictionChart: Invalid predictions data', predictions);
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#dc3545' }}>
        <p>⚠️ No prediction data available</p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Please try again.</p>
      </div>
    );
  }

  // --- 2. Filter valid prediction points ---
  const validPredictions = predictions.filter(
    (p) =>
      p &&
      p.date &&
      typeof p.predicted_price === 'number' &&
      !Number.isNaN(p.predicted_price)
  );

  if (validPredictions.length === 0) {
    console.error('PricePredictionChart: No valid predictions', predictions);
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#dc3545' }}>
        <p>⚠️ Invalid prediction data format</p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Expected: [ &#123;&quot;date&quot;: &quot;...&quot;, &quot;predicted_price&quot;: number&#125; ]
        </p>
      </div>
    );
  }

  if (validPredictions.length < predictions.length) {
    console.warn(
      `PricePredictionChart: Filtered ${
        predictions.length - validPredictions.length
      } invalid predictions`
    );
  }

  // --- 3. Prepare historical data (optional) ---
  let cleanedHistorical = [];
  if (historicalPrices && Array.isArray(historicalPrices) && historicalPrices.length > 0) {
    cleanedHistorical = historicalPrices
      .map((p) => {
        const date = p.date;
        const price =
          typeof p.price === 'number'
            ? p.price
            : typeof p.listing_price === 'number'
            ? p.listing_price
            : typeof p.predicted_price === 'number'
            ? p.predicted_price
            : null;

        if (!date || price === null || Number.isNaN(price)) return null;

        return { date, price };
      })
      .filter(Boolean);
  }

  // --- 4. Build labels + series using simple arrays ---
  const predictionDates = validPredictions.map((p) => p.date);
  const historicalDates = cleanedHistorical.map((p) => p.date);

  // Merge + dedupe dates for x-axis labels (string dates)
  const labelSet = new Set([...historicalDates, ...predictionDates]);
  const labels = Array.from(labelSet).sort((a, b) => new Date(a) - new Date(b));

  // Build lookup maps for quick access
  const historicalMap = new Map(
    cleanedHistorical.map((p) => [p.date, p.price])
  );
  const predictionMap = new Map(
    validPredictions.map((p) => [p.date, p.predicted_price])
  );

  // Data arrays aligned by labels
  const historicalSeries = labels.map((d) =>
    historicalMap.has(d) ? historicalMap.get(d) : null
  );
  const predictionSeries = labels.map((d) =>
    predictionMap.has(d) ? predictionMap.get(d) : null
  );

  const data = {
    labels,
    datasets: [
      ...(cleanedHistorical.length > 0
        ? [
            {
              label: 'Historical Prices',
              data: historicalSeries,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              pointRadius: 3,
              spanGaps: false,
            },
          ]
        : []),
      {
        label: 'Predicted Prices',
        data: predictionSeries,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 4,
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Price Prediction (${validPredictions.length} days)`,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            if (value == null || Number.isNaN(value)) return '';
            return `${context.dataset.label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value) {
            if (value == null || Number.isNaN(value)) return '';
            return '₹' + Number(value).toLocaleString();
          },
        },
        title: {
          display: true,
          text: 'Price (₹)',
        },
      },
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date',
        },
        ticks: {
          maxRotation: labels.length > 14 ? 45 : 0,
          minRotation: labels.length > 14 ? 45 : 0,
          maxTicksLimit: labels.length > 14 ? 15 : undefined,
        },
      },
    },
  };

  // --- 5. Trend calculation from predictions ---
  const firstPrice =
    validPredictions.length > 0 ? validPredictions[0].predicted_price : null;
  const lastPrice =
    validPredictions.length > 0
      ? validPredictions[validPredictions.length - 1].predicted_price
      : null;

  let priceChange = 0;
  let percentChange = 0;
  let isRising = false;

  if (
    typeof firstPrice === 'number' &&
    typeof lastPrice === 'number' &&
    firstPrice > 0
  ) {
    priceChange = lastPrice - firstPrice;
    percentChange = ((priceChange / firstPrice) * 100).toFixed(2);
    isRising = priceChange > 0;
  }

  const latencyLabel =
    typeof latencyMs === 'number' && !Number.isNaN(latencyMs)
      ? `${latencyMs}ms`
      : 'N/A';

  return (
    <div
      style={{
        width: '100%',
        height: labels.length > 14 ? '400px' : '300px',
        marginTop: '16px',
      }}
    >
      <Line data={data} options={options} />
      <div
        style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#666',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div>
          <span>Model: {modelVersion || 'N/A'}</span>
          <span style={{ marginLeft: '16px' }}>Latency: {latencyLabel}</span>
        </div>

        {firstPrice !== null && lastPrice !== null && (
          <div
            style={{
              fontWeight: 'bold',
              color: isRising ? '#28a745' : '#dc3545',
            }}
          >
            {isRising ? '📈' : '📉'}{' '}
            {isRising ? '+' : ''}
            {percentChange}% (
            {isRising ? '+' : ''}
            ₹{Math.abs(priceChange).toLocaleString()})
          </div>
        )}
      </div>
    </div>
  );
};

export default PricePredictionChart;
