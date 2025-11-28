import React, { useState } from 'react';
import { FaUpload, FaTrash, FaImage, FaVideo } from 'react-icons/fa';
import './AdminProductForm.css';

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
    video: null
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 3) {
      alert('Maximum 3 images allowed');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewImages([...previewImages, ...newImages]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        video: file
      }));
    }
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeVideo = () => {
    setVideoPreview(null);
    setFormData(prev => ({
      ...prev,
      video: null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <div className="admin-product-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="admin-product-form">
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              required
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Enter price"
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="category">Category *</label>
            <input
              type="text"
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Enter category"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              required
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              placeholder="Enter stock quantity"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter product description"
            rows="4"
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Product Images (Max 3) *</label>
            <div className="admin-upload-area">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="admin-file-input"
              />
              <label htmlFor="images" className="admin-upload-label">
                <FaImage /> Upload Images
              </label>
            </div>
            <div className="admin-preview-grid">
              {previewImages.map((image, index) => (
                <div key={index} className="admin-preview-item">
                  <img src={image.preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="admin-remove-btn"
                    onClick={() => removeImage(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-form-group">
            <label>Product Video (Optional)</label>
            <div className="admin-upload-area">
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleVideoChange}
                className="admin-file-input"
              />
              <label htmlFor="video" className="admin-upload-label">
                <FaVideo /> Upload Video
              </label>
            </div>
            {videoPreview && (
              <div className="admin-video-preview">
                <video src={videoPreview} controls />
                <button
                  type="button"
                  className="admin-remove-btn"
                  onClick={removeVideo}
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-submit-btn">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm; 