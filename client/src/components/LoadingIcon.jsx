import React from 'react';
import loader2 from '../assets/shopping.gif'
import  '../styles/LoadingIcon.css'
const LoadingIcon = () => {
  return (
    <div className="loading-icon">
      <img className='icon' src={loader2} />
    </div>
  );
};

export default LoadingIcon;
