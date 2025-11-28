import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Overview = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/admin/analytics', { withCredentials: true });
        setAnalytics(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="overview-section">
      <div className="stats-grid">
        {loading ? (
          // Loading skeletons for stats
          [...Array(4)].map((_, index) => (
            <div key={index} className="stat-card">
              <Skeleton height={24} width="60%" />
              <Skeleton height={32} width="40%" />
            </div>
          ))
        ) : (
          <>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-value">{analytics.totalOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Total Customers</h3>
              <p className="stat-value">{analytics.totalCustomers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{analytics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Average Order Value</h3>
              <p className="stat-value">
                ₹{analytics.totalOrders ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2) : 0}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="top-Adminproducts">
        <h2>Top Selling Products</h2>
        <div className="Adminproducts-grid">
          {loading ? (
            // Loading skeletons for top products
            [...Array(4)].map((_, index) => (
              <div key={index} className="Adminproduct-card">
                <Skeleton height={120} />
                <div className="Adminproduct-info">
                  <Skeleton height={24} width="80%" />
                  <Skeleton height={20} width="60%" />
                </div>
              </div>
            ))
          ) : (
            analytics.topProducts?.map(product => (
              <div key={product?._id} className="Adminproduct-card">
                <div className="Adminproduct-info">
                  <h3>{product.name}</h3>
                  <p>Units Sold: {product.totalQuantity}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview; 