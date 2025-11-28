import React, { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart, FaChartLine, FaPlus } from 'react-icons/fa';
import './styles/AdminDashboard.css';
import Overview from './components/Overview';
import AdminProducts from './components/AdminProducts';
import Orders from './components/Orders';
import CreateProduct from './components/CreateProduct';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [Adminproducts, setAdminProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topSellingAdminProducts, setTopSellingAdminProducts] = useState([]);
  const [showAdminProductForm, setShowAdminProductForm] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalAdminProducts: 0,
    revenue: 0
  });

  const [newAdminProduct, setNewAdminProduct] = useState({
    name: '',
    storge: '',
    color: '',
    description: '',
    price: '',
    stock: '',
    category: 'mobile',
    images: [''],
    video: '',
    features: [''],
    specifications: [{ key: '', value: '' }]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const AdminproductsRes = await fetch('/api/admin/Adminproducts');
      const AdminproductsData = await AdminproductsRes.json();
      setAdminProducts(AdminproductsData);

      const ordersRes = await fetch('/api/admin/orders/recent');
      const ordersData = await ordersRes.json();
      setRecentOrders(ordersData);

      const topAdminProductsRes = await fetch('/api/admin/Adminproducts/top-selling');
      const topAdminProductsData = await topAdminProductsRes.json();
      setTopSellingAdminProducts(topAdminProductsData);

      const analyticsRes = await fetch('/api/admin/analytics');
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleAdminProductChange = (e) => {
    const { name, value } = e.target;
    setNewAdminProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...newAdminProduct.images];
    newImages[index] = value;
    setNewAdminProduct(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setNewAdminProduct(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    const newImages = newAdminProduct.images.filter((_, i) => i !== index);
    setNewAdminProduct(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...newAdminProduct.features];
    newFeatures[index] = value;
    setNewAdminProduct(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeatureField = () => {
    setNewAdminProduct(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeatureField = (index) => {
    const newFeatures = newAdminProduct.features.filter((_, i) => i !== index);
    setNewAdminProduct(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...newAdminProduct.specifications];
    newSpecs[index] = {
      ...newSpecs[index],
      [field]: value
    };
    setNewAdminProduct(prev => ({
      ...prev,
      specifications: newSpecs
    }));
  };

  const addSpecificationField = () => {
    setNewAdminProduct(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecificationField = (index) => {
    const newSpecs = newAdminProduct.specifications.filter((_, i) => i !== index);
    setNewAdminProduct(prev => ({
      ...prev,
      specifications: newSpecs
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/Adminproducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdminProduct),
      });

      if (response.ok) {
        setShowAdminProductForm(false);
        fetchDashboardData();
        // Reset form
        setNewAdminProduct({
          name: '',
          storge: '',
          color: '',
          description: '',
          price: '',
          stock: '',
          category: 'mobile',
          images: [''],
          video: '',
          features: [''],
          specifications: [{ key: '', value: '' }]
        });
      }
    } catch (error) {
      console.error('Error creating Adminproduct:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <button 
            className="add-Adminproduct-btn"
            onClick={() => setShowAdminProductForm(true)}
          >
            <FaPlus /> Add New AdminProduct
          </button>
        </div>
      </div>

      {showAdminProductForm ? (
        <CreateProduct
          newAdminProduct={newAdminProduct}
          handleAdminProductChange={handleAdminProductChange}
          handleImageChange={handleImageChange}
          addImageField={addImageField}
          removeImageField={removeImageField}
          handleFeatureChange={handleFeatureChange}
          addFeatureField={addFeatureField}
          removeFeatureField={removeFeatureField}
          handleSpecificationChange={handleSpecificationChange}
          addSpecificationField={addSpecificationField}
          removeSpecificationField={removeSpecificationField}
          handleSubmit={handleSubmit}
          setShowAdminProductForm={setShowAdminProductForm}
        />
      ) : (
        <>
          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartLine /> Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'Adminproducts' ? 'active' : ''}`}
              onClick={() => setActiveTab('Adminproducts')}
            >
              <FaBox /> AdminProducts
            </button>
            <button 
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FaShoppingCart /> Orders
            </button>
          </div>

          <div className="dashboard-content">
            {activeTab === 'overview' && (
              <Overview 
                analytics={analytics}
                topSellingAdminProducts={topSellingAdminProducts}
              />
            )}

            {activeTab === 'Adminproducts' && (
              <AdminProducts Adminproducts={Adminproducts} />
            )}

            {activeTab === 'orders' && (
              <Orders recentOrders={recentOrders} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;