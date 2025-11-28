import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaTimes } from 'react-icons/fa';
import '../styles/CreateProduct.css';
import axios from 'axios';
import laoder from '../../../assets/loader.webp';

const initialValue = {
  name: '',
  storage: null,
  color: '',
  description: '',
  price: null,
  stock: null,
  category: 'mobile'
}

const CreateProduct = ({ setShowAdminProductForm }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [features, setFeatures] = useState(['']);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [loader, setloader] = useState(false)

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      storage: Yup.number().required('Required'),
      color: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      price: Yup.number().required('Required'),
      stock: Yup.number().required('Required'),
      category: Yup.string().required('Required')
    }),
    onSubmit: async (values) => {
      try {
        setloader(true)
        if (imageFiles.length === 0) return alert('At least 1 image is required');
        const formData = new FormData();
        for (let key in values) formData.append(key, values[key]);
        imageFiles.forEach((file) => formData.append('image', file));
        if (videoFile) formData.append('video', videoFile);
        formData.append('features', JSON.stringify(features));
        formData.append('specifications', JSON.stringify(specs));
        const res = await axios.post('http://localhost:3000/api/products', formData, { withCredentials: true, headers: { "Content-Type": 'multipart/form-data' } });
        console.log(res.data);

      } catch (error) {
        console.log(error.message);

      }
      finally {
        setloader(false);
      }
    }
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 3) {
      alert('Maximum 3 images allowed');
      return;
    }
    setImageFiles([...imageFiles, ...files]);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) setVideoFile(file);
  };

  const removeImage = (index) => {
    const updated = [...imageFiles];
    updated.splice(index, 1);
    setImageFiles(updated);
  };

  const updateFeature = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const updateSpec = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  return (
    <div className="create-product-container">
      <h2>Create Product</h2>
      <form className="create-product-form" onSubmit={formik.handleSubmit}>
        {/* Input Fields */}
        {['name', 'storage', 'color', 'price', 'stock'].map((field) => (
          <div className="form-group" key={field}>
            <label>{field[0].toUpperCase() + field.slice(1)}</label>
            <input
              type={field === 'storage' || field === 'price' || field === 'stock' ? 'number' : 'text'}
              name={field}
              onChange={formik.handleChange}
              value={formik.values[field]}
            />
            {formik.errors[field] && <div className="error">{formik.errors[field]}</div>}
          </div>
        ))}

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
          {formik.errors.description && <div className="error">{formik.errors.description}</div>}
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" onChange={formik.handleChange} value={formik.values.category}>
            <option value="mobile">Mobile</option>
            <option value="electronics">Electronics</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label>Images (Max 3)</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          <div className="preview-images">
            {imageFiles.map((file, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img src={URL.createObjectURL(file)} alt="preview" />
                <FaTimes className="remove-icon" onClick={() => removeImage(idx)} />
              </div>
            ))}
          </div>
        </div>

        {/* Video Upload */}
        <div className="form-group">
          <label>Video (optional)</label>
          <input type="file" accept="video/*" onChange={handleVideoChange} />
          {videoFile && (
            <div className="preview-video">
              <video src={URL.createObjectURL(videoFile)} controls />
            </div>
          )}
        </div>

        {/* Features */}
        <div className="form-group">
          <label>Features (Max 10)</label>
          {features.map((feature, idx) => (
            <div className="dynamic-array item" key={idx}>
              <input
                type="text"
                placeholder="Feature"
                value={feature}
                onChange={(e) => updateFeature(idx, e.target.value)}
              />
              {idx > 0 && (
                <FaTimes onClick={() => setFeatures(features.filter((_, i) => i !== idx))} />
              )}
            </div>
          ))}
          {features.length < 10 && (
            <button type="button" className="add-button" onClick={() => setFeatures([...features, ''])}>
              Add Feature
            </button>
          )}
        </div>

        {/* Specifications */}
        <div className="form-group">
          <label>Specifications (Max 6)</label>
          {specs.map((spec, idx) => (
            <div className="dynamic-array item" key={idx}>
              <input
                type="text"
                placeholder="Key"
                value={spec.key}
                onChange={(e) => updateSpec(idx, 'key', e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={(e) => updateSpec(idx, 'value', e.target.value)}
              />
              {idx > 0 && (
                <FaTimes onClick={() => setSpecs(specs.filter((_, i) => i !== idx))} />
              )}
            </div>
          ))}
          {specs.length < 6 && (
            <button type="button" className="add-button" onClick={() => setSpecs([...specs, { key: '', value: '' }])}>
              Add Specification
            </button>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" style={{ cursor: loader ? 'not-allowed' : 'allowed' }}>Create Product</button>
          {loader && <span style={{ width: '40px' }}><img src={laoder} width={'100%'} /></span>}
          <button type="button" className="cancel-btn" onClick={() => setShowAdminProductForm(false)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
