import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchResults.css';

// Predefined search categories
const searchCategories = [
  {
    title: 'Popular Models',
    items: ['iPhone 14', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 15 Pro Max']
  },
  {
    title: 'Categories',
    items: ['Pro Models', 'Regular Models', 'Max Series']
  },
  {
    title: 'Price Range',
    items: ['Under ₹80,000', 'Under ₹100,000', 'Above ₹100,000']
  }
];

// Sample product data
const dummyProducts = [
  {
    id: 1,
    name: 'iPhone 14 Pro Max',
    price: 139900,
    image: 'iphone-14-pro-max.jpg',
    description: 'A16 Bionic chip, 48MP camera system'
  },
  {
    id: 2,
    name: 'iPhone 14 Pro',
    price: 129900,
    image: 'iphone-14-pro.jpg',
    description: 'Dynamic Island, Always-On display'
  },
  {
    id: 3,
    name: 'iPhone 14 Plus',
    price: 89900,
    image: 'iphone-14-plus.jpg',
    description: 'Big beautiful 6.7-inch display'
  },
  {
    id: 4,
    name: 'iPhone 14',
    price: 79900,
    image: 'iphone-14.jpg',
    description: 'A15 Bionic chip, advanced camera'
  }
];

const SearchResults = ({ searchQuery, onClose }) => {
  const navigate = useNavigate();

  // If no search query, show search categories
  if (!searchQuery) {
    return (
      <div className="search-results-container">
        <div className="search-categories">
          {searchCategories.map((category, index) => (
            <div key={index} className="search-category">
              <h3>{category.title}</h3>
              <div className="search-options">
                {category.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="search-option"
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(item)}`);
                      onClose();
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filter products based on search query
  const filteredProducts = dummyProducts.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    const nameLower = product.name.toLowerCase();
    const descLower = product.description.toLowerCase();
    const priceLower = product.price.toString();

    return nameLower.includes(searchLower) || 
           descLower.includes(searchLower) || 
           priceLower.includes(searchLower) ||
           (searchLower === 'pro' && nameLower.includes('pro')) ||
           (searchLower === 'max' && nameLower.includes('max')) ||
           (searchLower.includes('under') && product.price < 100000) ||
           (searchLower.includes('above') && product.price > 100000);
  });

  // Show filtered products or no results message
  return (
    <div className="search-results-container">
      <div className="search-results">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className="search-result-item"
              onClick={() => {
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                onClose();
              }}
            >
              <img 
                src={`https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/${product.name.toLowerCase().replace(/ /g, '-')}-finish-select-202309-6-1inch_GEO_EMEA?wid=700&hei=700&fmt=jpeg&qlt=90&.v=1693009283811`} 
                alt={product.name} 
                className="search-result-image" 
              />
              <div className="search-result-info">
                <h3>{product.name}</h3>
                <p className="search-result-price">₹{product.price.toLocaleString()}</p>
                <p className="search-result-description">{product.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No products found for "{searchQuery}"</p>
            <div className="suggested-searches">
              <h4>Try these popular searches:</h4>
              <div className="search-options">
                {searchCategories[0].items.map((item, idx) => (
                  <div
                    key={idx}
                    className="search-option"
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(item)}`);
                      onClose();
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
