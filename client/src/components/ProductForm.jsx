import React, { useState } from 'react';
import axios from 'axios';
import './ProductForm.css';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    storage: '',
    color: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]); // Accept multiple images
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]); // Single video
  };

  const handleSubmit = async (e) => {
    console.log('form submit triggered');
    e.preventDefault();
    const data = new FormData();

    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Append image files (multiple)
    images.forEach((file) => {
      data.append('image', file);
    });

    // Append video file
    if (video) {
      data.append('video', video);
    }
    console.log(data);

    try {
      const res = await axios.post('http://localhost:3000/api/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      console.log(res);

      if (res.data.success) {
        setMessage('✅ Product uploaded successfully!');
      } else {
        setMessage(`❌ ${res.data.message}`);
      }
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Something went wrong'}`);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required />
        <input type="number" name="storage" placeholder="Storage (GB)" onChange={handleChange} required />
        <input type="text" name="color" placeholder="Color" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
        <input type="number" name="stock" placeholder="Stock" onChange={handleChange} required />

        <select name="category" onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="mobile">Mobile</option>
          <option value="electronics">Electronics</option>
        </select>

        <label>Upload Images (max 3):</label>
        <input type="file" name="image" onChange={handleImageChange} accept="image/*" multiple required />

        <label>Upload Video (optional):</label>
        <input type="file" name="video" onChange={handleVideoChange} accept="video/*" />

        <button type="submit">Submit</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ProductForm;
