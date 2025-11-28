import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaTimes } from 'react-icons/fa';
import './Orders.css';
import { useQuery } from '@tanstack/react-query';
import { AdminFectchOrders } from '../../../Api/Admin';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: AdminFectchOrders,
  })



  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:3000/api/admin/orders/${orderId}/cancel`);
      fetchOrders(); // Refresh orders after cancellation
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (error) return <div className="error">{error.message}</div>;

  return (
    <div className="orders-section">
      <h2>Recent Orders</h2>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* loading state */}
            {isLoading && (
              [...Array(5)].map((_, index) => {
                <tr key={index}>
                  <Skeleton height={40} style={{ marginBottom: '8px' }} />
                </tr>
              })
            )}

            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.slice(-6)}</td>
                <td>{order.user ? order.user.name : 'Guest'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <span className={`status ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <span className={`status ${order.paymentStatus}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => handleViewOrder(order)}
                    >
                      <FaEye /> View
                    </button>
                    {order.orderStatus === 'pending' && (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        <FaTimes /> Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={closeOrderDetails}>×</button>
            <h3>Order Details</h3>
            <div className="order-info">
              <div className="info-section">
                <h4>Customer Information</h4>
                <p>Name: {selectedOrder.user ? selectedOrder.user.name : 'Guest'}</p>
                <p>Email: {selectedOrder.user ? selectedOrder.user.email : 'N/A'}</p>
              </div>

              <div className="info-section">
                <h4>Shipping Address</h4>
                <p>City: {selectedOrder.shippingAddress.city}</p>
                <p>State: {selectedOrder.shippingAddress.state}</p>
                <p>Country: {selectedOrder.shippingAddress.country}</p>
                <p>ZIP Code: {selectedOrder.shippingAddress.zipCode}</p>
              </div>

              <div className="info-section">
                <h4>Order Items</h4>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <p>Product: {item.product.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price}</p>
                  </div>
                ))}
              </div>

              <div className="info-section">
                <h4>Payment Information</h4>
                <p>Total Amount: ₹{selectedOrder.totalAmount}</p>
                <p>Payment Mode: {selectedOrder.paymentMode}</p>
                <p>Payment Status: {selectedOrder.paymentStatus}</p>
              </div>

              <div className="info-section">
                <h4>Order Status</h4>
                <p>Status: {selectedOrder.orderStatus}</p>
                <p>Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;