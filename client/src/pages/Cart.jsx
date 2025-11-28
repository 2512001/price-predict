import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from '../redux/slices/cartSlice';
import '../styles/Cart.css';
import { toast } from 'react-toastify';
import { removeCartItem } from '../Api/api';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);


  const cartId = useSelector((state) => state.cart.cardId);


  const dispatch = useDispatch();

  const handleRemoveProduct = async (e, productId) => {
    console.log('triggered');
    
    e.preventDefault();
    try {
      removeCartItem({cartId , productId  });      
      dispatch(removeFromCart(productId))
    } catch (error) {

    }
  }


  const totalPrice = cartItems.reduce(
    (total, item) => total + item.productId.price * item.quantity, 0
  );

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map((item) => (
              <motion.div
                key={item.productId._id}
                className="cart-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="item-image">
                  <img src={item.productId.images[0]} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="storage">{item.productId.storage}</p>
                  <p className="price">₹{item.productId.price.toLocaleString()}</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => toast.warning('only now single unit can buy')}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => toast.warning('only now single unit can buy')}>+</button>
                </div>
                <div className="item-total">
                  ₹{(item.productId.price * item.quantity).toLocaleString()}
                </div>
                <button
                  className="remove-item"
                  onClick={(e) => handleRemoveProduct(e, item.productId._id)}
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-item">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-item total">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <Link to="/checkout" className="checkout-button">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
