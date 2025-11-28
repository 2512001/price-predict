import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductForm from './components/ProductForm';
import Login from './pages/Login';
import Signup from './pages/Singup';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import PaymentSuccess from './components/paymentSuccess';
import NotFound from './components/NotFound'; // ⬅️ 404 fallback

import './styles/Layout.css';
import LoadingIcon from './components/LoadingIcon';
import { fetchCart } from './Api/api';
import { addToCart } from './redux/slices/cartSlice';
import OrderSuccess from './components/OrderSuccess';
import OrderDetails from './pages/OrderDetails';
import TestPrediction from './pages/TestPrediction';

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);


  // const isLoggedIn = true;
  const { user, isLoggedIn } = useSelector((state) => state.userState);


  // ⏳ Show loader while auth state is undefined/null
  if (isLoggedIn === null || isLoggedIn === undefined) {
    return <LoadingIcon />;
  }

  useEffect(() => {
    const getCart = async () => {
      if (!user?.id) return;

      try {
        const cartData = await fetchCart(user.id);
        dispatch(addToCart(cartData));
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };

    getCart();
  }, [user?.id]);

  return (
    <Router>
      {isLoggedIn ? (
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/create" element={<ProductForm />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path='/order-Success' element={<OrderSuccess />} />
              <Route path='/order-details' element={<OrderDetails />} />
              <Route path="/test-prediction" element={<TestPrediction />} />

              <Route path="/*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-center"
            autoClose={1500}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="dark"
          />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/singup" element={<Signup />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
