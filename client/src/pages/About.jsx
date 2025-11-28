import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About Cashify</h1>
        <div className="about-content">
          <section className="about-section">
            <h2>Our Story</h2>
            <p>
              Welcome to Cashify, your premier destination for premium Apple iPhones. Founded with a passion
              for technology and customer satisfaction, we've been serving our community since 2020. Our
              mission is to provide authentic Apple products at competitive prices, backed by exceptional
              customer service.
            </p>
          </section>

          <section className="about-section">
            <h2>Why Choose Us?</h2>
            <div className="features-grid">
              <div className="feature">
                <i className="fas fa-check-circle"></i>
                <h3>Authentic Products</h3>
                <p>100% genuine Apple products with full warranty coverage</p>
              </div>
              <div className="feature">
                <i className="fas fa-shipping-fast"></i>
                <h3>Fast Delivery</h3>
                <p>Quick and secure shipping to your doorstep</p>
              </div>
              <div className="feature">
                <i className="fas fa-headset"></i>
                <h3>24/7 Support</h3>
                <p>Round-the-clock customer service to assist you</p>
              </div>
              <div className="feature">
                <i className="fas fa-shield-alt"></i>
                <h3>Secure Payments</h3>
                <p>Multiple secure payment options for your convenience</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Commitment</h2>
            <p>
              At Cashify, we're committed to providing the best shopping experience for our customers.
              We understand that buying a new iPhone is an important decision, which is why we offer
              detailed product information, competitive prices, and excellent after-sales support.
              Our team of experts is always ready to help you make the right choice for your needs.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About; 