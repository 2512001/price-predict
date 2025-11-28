import React from 'react';
import { FaBox, FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa';
import '../styles/OrderCard.css';
import { Link } from 'react-router-dom';

const OrderCard = ({ order }) => {
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'processing':
        return <FaClock className="status-icon processing" />;
      case 'shipped':
        return <FaTruck className="status-icon shipped" />;
      default:
        return <FaBox className="status-icon default" />;
    }
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-title">
          <h3>Order #{order.id}</h3>
          <span className="order-date">{order.date}</span>
        </div>
        <div className={`status ${order.orderStatus.toLowerCase()}`}>
          {getStatusIcon(order.orderStatus)}
          <span>{order.orderStatus}</span>
        </div>
      </div>

      <div className="order-items">
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <div className="item-image">
              <img src={item.product.images[0]} alt={item.name} />
            </div>
            <div className="item-details">
              <h4>{item.name}</h4>
              <p className="item-price">${item.price}</p>
              <p className="item-quantity">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${order.totalAmount}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>₹{0}</span>
        </div>
        <div className="summary-row total">
          <strong>Total</strong>
          <strong>₹{order.totalAmount}</strong>
        </div>
      </div>

      <div className="order-actions">
        <Link to={'/order-details'}><button className="btn primary">View Details</button></Link>
        <button className="btn secondary">Track Order</button>
      </div>
    </div>
  );
};

export default OrderCard;
