import React, { useState } from 'react';
import '../styles/Singup.css';
import { Link, useNavigate } from 'react-router-dom';
import { signupFunction } from '../Api/api';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { signupSchema } from '../utils/validation';
import { MdErrorOutline } from 'react-icons/md';

const intialValue = {
  name: '',
  email: '',
  password: '',
  ConfirmPassword: '',
  number: null
}



export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
    initialValues: intialValue,
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      try {
        const user = await signupFunction(values);
        if (user) {
          toast('user register successfully');
          navigate('/login');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }); 


  // const handlechange = (e) => {
  //   setUser((prev) => {
  //     return { ...prev, [e.target.name]: e.target.value }
  //   })
  // }

  // const handleSubmit = async (e) => {

  //   e.preventDefault();
  //   if (!userDetails.name || !userDetails.password || !userDetails.email) {
  //     return;
  //   }
  //   try {
  //     const user = await signupFunction(userDetails);
  //     console.log(user);
  //     dispatch(addUser(user));
  //     toast('user register successfully');
  //     navigate('/');

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <div className="signup-container premium">
      {/* Left Side */}
      <div className="signup-left">
        <div className="logo">LOGO</div>
        <h1 className="welcome-heading">Join Us Today!</h1>
        <p className="welcome-subtext">Create your account and start shopping.</p>
      </div>

      {/* Right Side with flip animation */}
      <div className="signup-right">
        <div className="form-wrapper flip-in">
          <h2 className="form-title">Create an account</h2>
          <p className="form-subtitle">Start your shopping journey with us.</p>

          <form className="form-fields" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <input type="text" name='name' value={values.name} onBlur={handleBlur} onChange={handleChange} className="input-field" placeholder="John Doe" />
              {touched.name && errors.name && (
                <span className='errors'>
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="input-label">Email Address</label>
              <input type="email" name='email' value={values.email} onBlur={handleBlur} onChange={handleChange} className="input-field" placeholder="you@example.com" />
              {touched.email && errors.email && (
                <span color='red' className='errors'>
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="input-label">primary number</label>
              <input type="number" name='number' value={values.number} onBlur={handleBlur} onChange={handleChange} className="input-field" placeholder="1234567890" />
              {touched.number && errors.number && (
                <span color='red' className='errors'>
                  {errors.number}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="input-label">Password</label>
              <input type="password" name='password' value={values.password} onBlur={handleBlur} onChange={handleChange} className="input-field" placeholder="••••••••" />
              {touched.password && errors.password && (
                <span color='red' className='errors'>
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="input-label">ConfirmPassword</label>
              <input type="password" name='ConfirmPassword' onBlur={handleBlur} value={values.confirmPassword} onChange={handleChange} className="input-field" placeholder="••••••••" />
              {touched.ConfirmPassword && errors.ConfirmPassword && (
                <span color='red' className='errors'>
                  {errors.ConfirmPassword}
                </span>
              )}
            </div>

            <button type="submit" className="submit-button">Sign Up</button>

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

          <Link to={'/login'} className="signup-text">
            Already have an account? <a href="#" className="signup-link">Log in</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
