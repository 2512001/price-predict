import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaArrowLeft, FaStar, FaStarHalfAlt, FaRegStar, FaChartLine } from 'react-icons/fa';
import '../styles/ProductDetails.css';
import { useQuery } from '@tanstack/react-query';
import { addCart, getreviews, getSingleProduct, predictPrice } from '../Api/api.js'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../redux/slices/cartSlice.js';
import PricePredictionChart from '../components/PricePredictionChart';

const ProductDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState('');
  const [page, setpage] = useState(1);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [predictionError, setPredictionError] = useState(null);
  const user = useSelector((state) => state.userState?.user);



  const { data: product, isLoading: isproductLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getSingleProduct(id),
  });




  const { data: { totalPage = 0, reviews = [] } = {}, isLoading: isReviewsLoading, error: isreviewsError } = useQuery({
    queryKey: ['reviews', page],
    queryFn: () => getreviews({ productId: product._id, page }),
    enabled: !!product?._id, // ensures productId exists before fetching

  });

  

  const handleAddCart = async (e) => {
    try {
      e.preventDefault();
      await addCart(product._id);
      dispatch(addToCart(product));
      toast.success(`${product.name} added to cart!`, {
        className: 'custom-toast',
      });
    } catch (error) {
      console.log(error);

      toast.error(error.message)
    }

  }


  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  const handlePredictPrice = async () => {
    if (isPredicting || !product?._id) return;

    setIsPredicting(true);
    setPredictionError(null);
    setPredictionData(null);

    try {
      // Get recent prices - in a real app, this would come from price history
      const recentPrices = [product.price * 0.95, product.price * 0.97, product.price];
      
      const response = await predictPrice({
        product_id: product._id,
        user_id: user?._id || 'anonymous',
        features: {
          recent_prices: recentPrices,
        },
        horizon_days: 7,
      });

      setPredictionData(response);
      toast.success('Price prediction generated!', {
        className: 'custom-toast',
      });
    } catch (error) {
      console.error('Prediction error:', error);
      setPredictionError(error.message || 'Failed to predict price. Please try again.');
      toast.error(error.message || 'Failed to predict price', {
        className: 'custom-toast',
      });
    } finally {
      setIsPredicting(false);
    }
  };




  return (
    <div className="product-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Products
      </button>

      <div className="product-container">
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={!selectedImage ? product?.images[0] : selectedImage}
              alt={product?.name}
              loading="lazy"
            />
          </div>
          <div className="thumbnail-container">
            {product?.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === image ? 'active' : ''}`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product?.name}</h1>
            <div className="product-rating">
              <div className="stars">
                <FaStar color='white' className="star-icon" />
                <span>{product?.averageRating > 0 ? product?.averageRating : 5}</span>
              </div>
              <span className="rating-text">
                (<span>{product?.TotalReview > 0 && product?.TotalReview}</span> reviews)
              </span>
            </div>
          </div>

          <p className="product-price">${product?.price.toLocaleString()}</p>

          <div className="product-meta">
            <span className="meta-item">
              <strong>Storage:</strong> {product?.storage}
            </span>
            <span className="meta-item">
              <strong>Color:</strong> {product?.color}
            </span>
          </div>

          <p className="product-description">{product?.description}</p>

          {product?.features.length > 0 && (
            <div className="product-features">
              <h2>Key Features</h2>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )
          }
          {product?.specifications.length > 0 && (
            <div className="product-specifications">
              <h2>Specifications</h2>
              <div className="specs-grid">
                {product?.specifications.map((data, index) => (
                  <div key={index} className="spec-item">
                    <span className="spec-label">{data.key}</span>
                    <span className="spec-value">{data.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )
          }

          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>

            <div className="action-buttons">
              <button className="add-to-cart" onClick={handleAddCart}>
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="add-to-wishlist" onClick={() => toast.warning('This feature will be introduced soon!')}>
                <FaHeart /> Add to Wishlist
              </button>
            </div>
          </div>

          {/* Price Prediction Section */}
          <div className="price-prediction-section">
            <h2>Price Prediction</h2>
            <button
              onClick={handlePredictPrice}
              disabled={isPredicting || !product?._id}
              className={`predict-price-btn ${isPredicting ? 'loading' : ''}`}
            >
              <FaChartLine /> {isPredicting ? 'Predicting…' : 'Predict Future Prices'}
            </button>

            {predictionError && (
              <div className="prediction-error">
                <p>{predictionError}</p>
                <button
                  onClick={handlePredictPrice}
                  className="retry-btn"
                  disabled={isPredicting}
                >
                  Retry
                </button>
              </div>
            )}

            {predictionData && (
              <div className="prediction-chart-container">
                <PricePredictionChart
                  predictions={predictionData.predictions || []}
                  historicalPrices={null}
                  modelVersion={predictionData.model_version}
                  latencyMs={predictionData.latency_ms}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="review-wrapper">
        <h2 className="review-title">Customer Reviews</h2>

        <div className="review-summary">
          <div className="review-average">
            <h3>{<span>{product?.averageRating > 0 ? product?.averageRating : 5}</span>
            } out of 5</h3>
            <div className="star-row">
              {[1, 2, 3, 4, 5].map((i) => {
                if (i <= Math.floor(product?.averageRating)) {
                  return <FaStar key={i} className="star" />;
                } else if (i === Math.floor(product?.averageRating) + 1 && product?.averageRating % 1 >= 0.5) {
                  return <FaStarHalfAlt key={i} className="star" />;
                } else {
                  return <FaRegStar key={i} className="star" />;
                }
              })}
            </div>
            <p>{product?.TotalReview > 0 && product?.TotalReview} Verified Reviews</p>
          </div>

          <div className="review-bars">
            {[, , , ,].map(({ star, count }) => {
              const percentage = ((count / reviews.length) * 100).toFixed(1);
              return (
                <div className="bar-row" key={star}>
                  <span className="bar-label">{star} star</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {reviews.length > 0 && (<div className="review-list">
          {reviews?.map((review) => (
            <div className="review-card" key={review._id}>
              <div className="review-header">
                <img
                  src={`https://ui-avatars.com/api/?name=${review.userId?.username || "User"}`}
                  alt="user"
                />
                <div className="review-user">
                  <span className="name">{review.userId?.username || "Anonymous"}</span>
                  <span className="date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  <div className="star-row">
                    {[1, 2, 3, 4, 5].map((i) => {
                      if (i <= Math.floor(review?.rating)) {
                        return <FaStar key={i} className="star" />;
                      } else if (i === Math.floor(review?.rating) + 1 && review?.rating % 1 >= 0.5) {
                        return <FaStarHalfAlt key={i} className="star" />;
                      } else {
                        return <FaRegStar key={i} className="star" />;
                      }
                    })}
                  </div>
                </div>
              </div>
              <p className="review-text">{review.comment}</p>
            </div>
          ))}

          <div className="pagination">
            <button
              onClick={() => setpage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {totalPage}</span>
            <button
              onClick={() => setpage((prev) => {
                if (prev < totalPage) {
                  return prev + 1;
                }
                return prev;
              })}
              disabled={page === totalPage}
            >
              Next
            </button>
          </div>

        </div>)}
      </div>

    </div>
  );
};

export default ProductDetails; 