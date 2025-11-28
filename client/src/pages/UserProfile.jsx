import React, { useEffect, useState } from 'react';
import { FaUser, FaShoppingBag, FaCog, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/UserProfile.css';
import { useDispatch, useSelector } from 'react-redux';
import Orders from '../components/Orders';
import { useLocation } from 'react-router-dom';
import { updateUser } from '../Api/api';
import { addUser } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state) => state.userState.user);
  const location = useLocation();
  const [editUser, seteditUser] = useState();
  const dispatch = useDispatch();



  useEffect(() => {
    const active = location.state?.activeTab;
    if (active) {
      setActiveTab(active)
    }
  }, [location])


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    seteditUser(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handlesubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await updateUser({ _id: user._id, ...editUser });
      dispatch(addUser(response))
      toast('user updated succesfully');
      handleCancel();
    } catch (error) {
      console.log(error.message);

    }

  }

  const renderProfile = () => (
    <div className="profile-section">
      <h2>Personal Information</h2>
      <div className="profile-info">
        {isEditing ? (
          <form onSubmit={handlesubmit}>
            <div className="info-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                defaultValue={user?.name}
                value={editUser?.name}
                onChange={handleInputChange}
                className="edit-input"
              />
            </div>
            <div className="info-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={user?.email}
                onChange={handleInputChange}
                disabled={true}
                style={{
                  cursor: 'not-allowed',
                  opacity: 0.6
                }}
                className="edit-input"
              />
            </div>
            <div className="info-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                defaultValue={user?.phone}
                value={editUser?.phone}
                onChange={handleInputChange}
                className="edit-input"
              />
            </div>
            <div className="info-group">
              <label>Address</label>
              <textarea
                name="address"
                defaultValue={user?.address}
                value={editUser?.address}
                onChange={handleInputChange}
                className="edit-input address"
                style={{ resize: 'vertical', width: '92%', minHeight: '60px' }}

              />
            </div>
            <div className="edit-actions">
              <button className="save-button" type='submit'>
                <FaSave /> Save Changes
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="info-group">
              <label>Name</label>
              <p>{user?.name}</p>
            </div>
            <div className="info-group">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-group">
              <label>Phone</label>
              <p>{user?.phone}</p>
            </div>
            <div className="info-group">
              <label>Address</label>
              <p>{user?.address}</p>
            </div>
            <div className="info-group">
              <label>Member Since</label>
              <p>{user?.createdAt}</p>
            </div>
            <button className="edit-button" onClick={handleEdit}>
              <FaEdit /> Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );



  const renderSettings = () => (
    <div className="settings-section">
      <h2>Account Settings</h2>
      <div className="settings-list">
        <div className="setting-item">
          <h3>Password</h3>
          <p>Change your password</p>
          <button className="change-button"   onClick={() => toast.info('Password change coming soon 🔒')}>Change Password</button>
        </div>
        <div className="setting-item">
          <h3>Notifications</h3>
          <p>Manage your notification preferences</p>
          <button className="change-button" onClick={()=> toast.info('Manage notifications coming soon 🔧')}>Manage Notifications</button>
        </div>
        <div className="setting-item">
          <h3>Privacy</h3>
          <p>Manage your privacy settings</p>
          <button className="change-button" onClick={()=>toast.info('Under development 🛠️')}>Privacy Settings</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-profile-page">
      <div className="profile-sidebar">
        <div className="user-summary">
          <div className="user-avatar">
            <FaUser />
          </div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
        <nav className="profile-nav">
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </button>
          <button
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingBag /> Orders
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>
        </nav>
      </div>
      <div className="profile-content">
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'orders' && <Orders />}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default UserProfile; 