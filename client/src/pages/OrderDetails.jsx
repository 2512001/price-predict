import React, { useState } from 'react';
import '../styles/OrderDetails.css'

const OrderDetails = () => {
    const [order, setOrder] = useState({
        _id: '64a123456abcde78901234f',
        orderStatus: 'pending',
        paymentStatus: 'completed',
        paymentMethod: 'Razorpay',
        totalAmount: 99999,
        shippingAddress: {
            street: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            zipCode: '400001'
        },
        items: [
            {
                product: {
                    name: 'iPhone 15 Pro Max',
                    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-1-202309?wid=512&hei=512&fmt=jpeg&qlt=95&.v=1692916350089'
                },
                quantity: 1,
                price: 99999
            }
        ],
        trackingSteps: [
            { label: "Order Placed", date: "2025-07-03" },
            { label: "Processing", date: "2025-07-04" },
            { label: "Shipped", date: "2025-07-05" },
            { label: "Out for Delivery", date: null },
            { label: "Delivered", date: null }
        ]
    });

    const [showCancelOptions, setShowCancelOptions] = useState(false);

    const handleCancelOrder = () => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            setOrder({ ...order, orderStatus: 'cancelled' });
        }
    };

    const getStepStatus = (step) => {
        const currentIndex = order.trackingSteps.findIndex(s => s.label.toLowerCase() === order.orderStatus);
        const stepIndex = order.trackingSteps.findIndex(s => s.label === step.label);
        return stepIndex <= currentIndex ? 'completed' : 'pending';
    };


    const lastCompletedIndex = order.trackingSteps.findIndex(s => !s.date) - 1;

    return (
        <div className="order-page-container">
            <h2>Order Summary</h2>

            <div className="order-card">
                <div className="section">
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Status:</strong>
                        <span className={`status-badge ${order.orderStatus}`}>
                            {order.orderStatus}
                        </span>
                    </p>
                    <p><strong>Payment:</strong> {order.paymentStatus} via {order.paymentMethod}</p>
                    <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                </div>

                <div className="section">
                    <h3>Shipping Address</h3>
                    <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country} - {order.shippingAddress.zipCode}</p>
                </div>

                <div className="section">
                    <h3>Items</h3>
                    {order.items.map((item, index) => (
                        <div className="order-item" key={index}>
                            <img src={item.product.image} alt={item.product.name} />
                            <div className="item-details">
                                <p className="item-name">{item.product.name}</p>
                                <p>{item.quantity} × ₹{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="section">
                    <h3>Track Order</h3>
                    <div className="tracking-timeline">
                        {order.trackingSteps.map((step, index) => {
                            const status = getStepStatus(step);
                            return (
                                <div key={index} className={step.date ? 'timeline-step completed' : 'timeline-step pending'}>
                                    <div className="circle" />
                                    <div className="timeline-content">
                                        <p className="label">{step.label}</p>
                                        <p className="date">{step.date ? step.date : 'Pending'}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {order.orderStatus === 'pending' && (
                    <div className="cancel-section">
                        <button
                            className="toggle-cancel-btn"
                            onClick={() => setShowCancelOptions(!showCancelOptions)}
                        >
                            {showCancelOptions ? 'Hide' : 'Need Help?'}
                        </button>

                        {showCancelOptions && (
                            <div className="cancel-confirm-box">
                                <p>Want to cancel this order?</p>
                                <button className="cancel-btn" onClick={handleCancelOrder}>
                                    Cancel Order
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
