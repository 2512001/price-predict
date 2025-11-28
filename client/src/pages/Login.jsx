import React, { useState } from 'react';
import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginFunction } from '../Api/api';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';

export default function Login() {

  let [email, setemail] = useState('');
  let [password, setpassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return
    }
    const userCredential = {
      email,
      password
    }

    const user = await loginFunction(userCredential);
    if (user) {
      dispatch(addUser(user));
      toast('user logged');
      navigate('/')
    }
  }
  return (
    <div className="login-container premium">
      {/* Left Side */}
      <div className="login-left">
        <div className="logo">LOGO</div>
        <h1 className="welcome-heading">Welcome Back!</h1>
        <p className="welcome-subtext">Shop smart. Shop easy.</p>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <div className="form-wrapper">
          <h2 className="form-title">Sign in to your account</h2>
          <p className="form-subtitle">or create an account</p>

          <form onSubmit={handleLogin} className="form-fields">
            <div className="form-group">
              <label className="input-label">Email address</label>
              <input type="email" required className="input-field" value={email} onChange={(e) => setemail(e.target.value)} placeholder="you@example.com" />
            </div>

            <div className="form-group">
              <label className="input-label">Password</label>
              <input type="password" required className="input-field" value={password} onChange={(e) => setpassword(e.target.value)} placeholder="••••••••" />
            </div>

            <button type="submit" className="submit-button">Sign in</button>

            <div className="divider">
              <hr className="divider-line" />
              <span className="divider-text">OR</span>
              <hr className="divider-line" />
            </div>

            <button type="button" className="google-button">
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="google-icon" />
              Continue with Google
            </button>
          </form>
          <Link to={'/singup'}>
            <p className="signup-text">
              Don't have an account? <a href="#" className="signup-link">Sign up</a>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
