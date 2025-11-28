import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import '../styles/PaymentSuccess.css'; // Import CSS
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state?.paymentSuccess) {
            navigate('/'); // redirect if someone tries to open manually
        }
    }, [location, navigate]);

    const handleRedirect = () => {
        navigate('/profile', {
            state: {
                activeTab: 'orders'
            },
        });
    }

    return (
        <div className="payment-success-container">
            <FaCheckCircle className="success-icon" />
            <h1 className="success-title">Payment Successful!</h1>
            <p className="success-message">
                Thank you for your purchase. Your transaction has been completed successfully.
            </p>
            <button className="success-button" onClick={handleRedirect}>
                Go to Homepage
            </button>
        </div>
    );
};

export default PaymentSuccess;
