import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import '../styles/Product.css';

const Product = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getImageUrl = (productName) => {
    const imageMap = {
      'iPhone 15 Pro Max': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283811',
      'iPhone 15 Pro': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283811',
      'iPhone 15 Plus': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-plus-finish-select-202309-6-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283811',
      'iPhone 15': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283811',
      'iPhone 14 Pro Max': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660753059843',
      'iPhone 14 Pro': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660753059843',
      'iPhone 14 Plus': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-plus-finish-select-202209-6-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660753059843',
      'iPhone 14': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660753059843',
      'iPhone 13 Pro Max': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-max-finish-select-202207-6-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1654026289843',
      'iPhone 13 Pro': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-finish-select-202207-6-1inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1654026289843',
      'iPhone 13': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-finish-select-202207-6-1inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1654026289843',
      'iPhone 13 mini': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-mini-finish-select-202207-5-4inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1654026289843',
      'iPhone 12 Pro Max': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-pro-max-finish-select-202207-6-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1654026289843',
      'iPhone 12 Pro': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-pro-finish-select-202207-6-1inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1654026289843',
      'iPhone 12': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-finish-select-202207-6-1inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1654026289843',
      'iPhone 12 mini': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-mini-finish-select-202207-5-4inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1654026289843',
      'iPhone 11 Pro Max': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-11-pro-max-finish-select-201909-6-5inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1566953739843',
      'iPhone 11 Pro': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-11-pro-finish-select-201909-5-8inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1566953739843',
      'iPhone 11': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-11-finish-select-201909-6-1inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1566953739843',
      'iPhone SE': 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-se-finish-select-202207-4-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1654026289843'
    };

    return imageMap[productName] || 'https://via.placeholder.com/300x300?text=No+Image';
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="star half" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  return (
    <Link to={`/product/${product.id}`} className="product-link">
      <div 
        className="product-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="product-image-container">
          <img 
            src={getImageUrl(product.name)} 
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          <div className={`product-overlay ${isHovered ? 'visible' : ''}`}>
            <button 
              className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlistClick}
            >
              <FaHeart />
            </button>
            <button className="add-to-cart-button">
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>
        
        <div className="product-info">
          <div className="product-header">
            <h3 className="product-title">{product.name}</h3>
            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-text">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>
          
          <div className="product-meta">
            <span className="storage">{product.storage}</span>
            <span className="color">{product.color}</span>
          </div>
          
          <div className="product-price">
            ${product.price.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Product; 