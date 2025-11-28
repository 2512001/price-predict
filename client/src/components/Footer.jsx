import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import '../styles/Footer.css';
import { toast } from 'react-toastify';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <h3>iPhone Store</h3>
            <p>Your premium destination for Apple products</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook fontSize={'20px'} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaSquareXTwitter fontSize={'20px'} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram fontSize={'20px'} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin fontSize={'20px'} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>Shop</h4>
          <ul className="footer-links">
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?category=iphone">iPhones</Link></li>
            <li><Link to="/products?category=ipad">iPads</Link></li>
            <li><Link to="/products?category=mac">MacBooks</Link></li>
            <li><Link to="/products?category=accessories">Accessories</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/returns">Returns Policy</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/warranty">Warranty</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Newsletter</h4>
          <div className="newsletter">
            <p>Subscribe to our newsletter for the latest updates and offers</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit" onClick={() =>toast.info('Coming soon 🚀')}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} iPhone Store. All rights reserved.</p>
          <div className="payment-methods">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-amex"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-apple-pay"></i>
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;