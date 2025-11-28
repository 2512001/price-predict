import React, { useEffect, useState } from 'react';
import '../styles/Checkout.css';
import { FaCreditCard, FaPaypal } from 'react-icons/fa';
import { BsCash, BsBank2 } from "react-icons/bs";
import { SiRazorpay, SiPaytm } from "react-icons/si";
import { FaGooglePay } from "react-icons/fa6";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { checkoutSchema } from '../utils/validation';
import { clearCart } from '../redux/slices/cartSlice';

const intialValue = {
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  paymentMethod: ''
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()


  const cartItems = useSelector((state) => state.cart.items);


  const { values, handleSubmit, handleChange, handleBlur, touched, errors, setFieldValue } = useFormik({
    initialValues: intialValue,
    validationSchema: checkoutSchema,
    onSubmit: async (values) => {
      if (!values.paymentMethod) {
        toast.error("Please select a payment method");
        return;
      }
      try {
        // Send the cart items and shipping address to create the order
        const payload = {
          items: cartItems.map((item) => ({
            product: item.productId._id,
            quantity: item.quantity
          })),
          shippingAddress: {
            street: values.address,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            country: values.country,
          },
          paymentMethod: values.paymentMethod
        };
        // Call the backend to create the Razorpay order
        const { data } = await axios.post("http://localhost:3000/api/orders", payload, { withCredentials: true });


        if (!data.success) return toast('order not created');
        if (data.paymentMethod === 'cod') {
          dispatch(clearCart());
          toast.success('order created successfully');
          return navigate('/order-success');
        }
        //  Trigger Razorpay payment gateway
        openRazorpayPayment(data);
      } catch (err) {
        console.log('error triggered');
        console.log(err);
        alert("Order failed");
      }
    }
  });




  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);




  const openRazorpayPayment = (orderData) => {
    const options = {
      key: "rzp_test_bIeysiWYbzTB64", // Replace with your Razorpay key
      amount: orderData.amount,
      currency: "INR",
      name: "My Store",
      description: "Test Transaction",
      order_id: orderData.orderId,

      handler: async function (response) {
        try {
          // Verify payment after user completes payment
          const verifyRes = await axios.post("http://localhost:3000/api/orders/payment/verify", {
            ...response,
            order_id: orderData.orderId,
          }, {
            withCredentials: true
          });
          //verify payment 
          if (verifyRes.data.success) {
            dispatch(clearCart())
            navigate('/payment-success', { state: { paymentSuccess: true } })
          } else {
            alert("❌ Payment failed");
          }
        } catch (err) {
          console.error(err);
          alert("Verification error");
        }
      },

      prefill: {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.productId.price * item.quantity, 0);
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Information</h2>
          <div className="form-grid">
            {[
              { label: 'First Name', name: 'firstName' },
              { label: 'Last Name', name: 'lastName' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'street', name: 'street' },
              { label: 'City', name: 'city' },
              { label: 'State', name: 'state' },
              { label: 'ZIP Code', name: 'zipCode' }
            ].map(({ label, name, type = 'text' }) => (
              <div className="form-group" key={name}>
                <label htmlFor={name}>{label}</label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={values[name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched[name] && errors[name] && (
                  <span className='errors'>{errors[name]}</span>
                )}
              </div>
            ))}

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={values.country}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              >
                <option value="">Select Country</option>
                <option value="INDIA">India</option>
                <option value="USA">United States</option>
                <option value="CANADA">Canada</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
          </div>

          <h2>Payment Method</h2>
          <div className="payment-methods">
            <div
              className={`payment-method ${values.paymentMethod === 'cod' ? 'selected' : ''}`}
              onClick={() => setFieldValue('paymentMethod', 'cod')}
            >
              <BsCash />
              <span> Cash on Delivery</span>
            </div>
            <div
              className={`payment-method ${values.paymentMethod === 'Razorpay' ? 'selected' : ''}`}
              onClick={() => setFieldValue('paymentMethod', 'Razorpay')}
            >
              <FaCreditCard />
              <SiRazorpay />
              <FaGooglePay style={{ fontSize: '25px' }} />
              <SiPaytm style={{ fontSize: '25px' }} />
              <BsBank2 />
              <span>Razor pay</span>
            </div>
          </div>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item.productId._id} className="order-item">
                <span>{item.productId.name}</span>
                <span>${item.productId.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>
          <button type="submit" className="place-order-button" onClick={(e) => { handleSubmit(e) }}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
