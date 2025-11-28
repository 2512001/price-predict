import { motion } from 'framer-motion';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const getImageUrl = (id) => {
    const imageMap = {
      1: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283811',
      2: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283811',
      3: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660753059843',
      4: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660753059843'
    };
    return imageMap[id] || 'https://via.placeholder.com/300x300?text=No+Image';
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1>Buy Your Dream iPhone Today</h1>
          <p>Experience the latest technology with our premium selection of iPhones</p>
          <Link to='/products' style={{ textDecoration: 'none', color: "white" }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button"
            >

              Shop Now
            </motion.button>
          </Link>

        </motion.div>
      </section>



      {/* Featured Products Section */}
      <section className="featured-products">
        <h3>Featured iPhones</h3>
        <div className="products-grid">
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              className="product-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="product-image">
                <img src={getImageUrl(item)} alt={`iPhone ${item}`} />
              </div>
              <div className="product-info">
                <h3>iPhone {item}</h3>
                <p>Starting at $999</p>
                <button className="buy-button">View Details</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="new-arrivals">
        <h3>New Arrivals</h3>
        <div className="products-grid">
          {[5, 6, 7, 8].map((item) => (
            <motion.div
              key={item}
              className="product-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="product-image">
                <img src={`/iphone-${item}.jpg`} alt={`iPhone ${item}`} />
              </div>
              <div className="product-info">
                <h3>iPhone {item}</h3>
                <p>Starting at $999</p>
                <button className="buy-button">View Details</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 