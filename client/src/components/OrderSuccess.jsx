import { FaCheckCircle } from 'react-icons/fa';
import '../styles/OrderSuccess.css'; // Create this or reuse PaymentSuccess.css
import { Link, useNavigate } from 'react-router-dom';
import '../styles/OrderSuccess.css'

const OrderSuccess = () => {
    const navigate = useNavigate();

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
            <h1 className="success-title">Order Successful!</h1>
            <p className="success-message">
                Thank you for placing your order. We are now processing it.
            </p>
            <button className="success-button" onClick={handleRedirect}>
                Go to order page
            </button>
        </div>
    );
};

export default OrderSuccess;
