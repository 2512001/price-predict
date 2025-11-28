import React from "react";
import "../styles/PredictionResult.css";

const PredictionResult = ({ data, onClose }) => {
  if (!data) return null;

  const {
    model_name,
    current_price_inr,
    predicted_new_price_inr,
    price_drop_inr,
    percent_drop,
    will_drop,
    drop_probability,
    latency_ms,
  } = data;

  return (
    <div className="prediction-box">
      <button className="close-btn" onClick={onClose}>✖</button>

      <h3 className="prediction-title">
        {will_drop ? "📉 Price Expected to Drop" : "📈 Price Likely Stable"}
      </h3>

      <p className="prediction-detail">
        <strong>Model:</strong> {model_name}
      </p>
      <p className="prediction-detail">
        <strong>Prediction Confidence:</strong> {(drop_probability * 100).toFixed(0)}%
      </p>

      {will_drop ? (
        <>
          <p className="prediction-price">
            Expected New Price: <span>₹{Math.round(predicted_new_price_inr).toLocaleString()}</span>
          </p>
          <p className="prediction-drop">
            Estimated Drop: <span>₹{Math.round(price_drop_inr).toLocaleString()}</span> ({percent_drop.toFixed(2)}%)
          </p>
        </>
      ) : (
        <p className="prediction-stable">
          No major price drop expected soon. Good time to buy ✔
        </p>
      )}

      <p className="prediction-latency">⏱ {latency_ms}ms</p>
    </div>
  );
};

export default PredictionResult;
