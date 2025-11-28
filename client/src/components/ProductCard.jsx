import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaStar, FaChartLine } from 'react-icons/fa';
import '../styles/ProductCard.css';
import { addToCart } from '../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addCart } from '../Api/api';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.userState?.user);

  const calculateDiscount = (original, current) => {
    const percent = Math.round(((original - current) / original) * 100);
    return percent;
  };

  const originalPrice = product.price + 5000;
  const discount = calculateDiscount(originalPrice, product.price);

  const handleAddCart = async (e) => {
    try {
      e.preventDefault();
      await addCart(product._id);
      dispatch(addToCart(product));
      toast.success(`${product.name} added to cart!`, { className: 'custom-toast' });
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- PRICE PREDICTION ----------------
  const handlePredictPrice = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPredicting) return;

    setIsPredicting(true);
    setPredictionError(null);
    setPredictionResult(null);

    try {
      const res = await fetch("http://localhost:3000/api/v1/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product._id,
          user_id: user?._id || "anonymous",
          features: {
            model_name: product.name,
            storage_gb: product.storage || 128,
            months_since_launch: product.months_since_launch || 8,
            current_price_inr: product.price,
          }
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Prediction failed");

      setPredictionResult(data);
      toast.success("✔ Price prediction generated!", { className: "custom-toast" });

    } catch (err) {
      setPredictionError(err.message || "Prediction failed");
      toast.error(err.message || "Prediction failed");
    } finally {
      setIsPredicting(false);
    }
  };
  // ---------------------------------------------------

  return (
    <div className="product-card-wrapper">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-card">
          <div className="img-container">
            <img src={product.images[0]} alt={product.name} />
            {product.stock < 5 && <span className="stock-badge">Only {product.stock} left!</span>}
          </div>

          <div className="info">
            <h2>{product.name}</h2>
            <div className="price-wrapper">
              <span className="price">₹{product.price.toLocaleString()}</span>
              <span className="original">₹{originalPrice.toLocaleString()}</span>
              <span className="discount">({discount}% OFF)</span>
            </div>

            <div className="stars">
              <FaStar color='white' className="star-icon" />
              <span>{product.averageRating > 0 ? product.averageRating : 5}</span>
            </div>

            <div className="actions">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsWishlisted(!isWishlisted);
                  toast.warning("This feature will be introduced soon!");
                }}
                className={`wishlist ${isWishlisted ? "active" : ""}`}
              >
                <FaHeart /> {isWishlisted ? "Wishlisted" : "Wishlist"}
              </button>

              <button onClick={(e) => handleAddCart(e)} className="cart">
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* ---------------- PREDICTION UI ---------------- */}
      <div className="predict-section" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handlePredictPrice}
          disabled={isPredicting}
          className={`predict-btn ${isPredicting ? "loading" : ""}`}
        >
          <FaChartLine /> {isPredicting ? "Predicting…" : "Predict Price"}
        </button>

        {predictionError && (
          <div className="prediction-error">
            <p>{predictionError}</p>
            <button onClick={handlePredictPrice} className="retry-btn" disabled={isPredicting}>
              Retry
            </button>
          </div>
        )}

        {predictionResult && (
          <div className="prediction-box">
            <div className="pp-header">
              <strong>{predictionResult.will_drop ? "📉 Price Expected to Drop" : "📈 Price Stable"}</strong>
              <span className="pp-close" onClick={() => setPredictionResult(null)}>✖</span>
            </div>

            <p><strong>Confidence:</strong> {(predictionResult.drop_probability * 100).toFixed(0)}%</p>

            {predictionResult.will_drop ? (
              <>
                <p className="pp-new-price">
                  Expected New Price:
                  <span> ₹{Math.round(predictionResult.predicted_new_price_inr).toLocaleString()}</span>
                </p>
                <p className="pp-drop">
                  Estimated Drop:
                  <span> ₹{Math.round(predictionResult.price_drop_inr).toLocaleString()}</span>
                  {" (" + predictionResult.percent_drop.toFixed(2) + "%)"}
                </p>
              </>
            ) : (
              <p className="pp-stable">Great time to buy — no major drop expected ✔</p>
            )}

            <p className="pp-latency">⏱ {predictionResult.latency_ms}ms</p>
          </div>
        )}
      </div>
      {/* ------------------------------------------------ */}
    </div>
  );
};

export default ProductCard;
