import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState(['']);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('form submit triggered');
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', description);
    formData.append('category', category);
    features.forEach((f, i) => formData.append(`features[${i}]`, f));
    images.forEach((img) => formData.append('image', img));
    if (video) formData.append('video', video);

    try {
      const res = await axios.post('http://localhost:5000/api/products', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(res);
      alert('Product uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Upload Product</h2>
      <input type="text" placeholder="Product Name" className="input" value={productName} onChange={(e) => setProductName(e.target.value)} required />
      <textarea placeholder="Description" className="input" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
      <input type="text" placeholder="Category" className="input" value={category} onChange={(e) => setCategory(e.target.value)} required />

      {features.map((f, i) => (
        <input key={i} type="text" placeholder={`Feature ${i + 1}`} className="input" value={f} onChange={(e) => handleFeatureChange(i, e.target.value)} />
      ))}
      <button type="button" className="btn" onClick={addFeature}>Add Feature</button>

      <div className="mt-4">
        <label>Upload Images</label>
        <input type="file" multiple onChange={handleImageChange} />
        <div className="grid grid-cols-3 gap-2 mt-2">
          {images.map((img, idx) => (
            <img key={idx} src={URL.createObjectURL(img)} alt="preview" className="w-full h-24 object-cover rounded" />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label>Upload Video</label>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        {video && (
          <video src={URL.createObjectURL(video)} controls className="w-full mt-2 rounded" height="150"></video>
        )}
      </div>

      <button type="submit" className="btn mt-4">Submit</button>
    </form>
  );
};

export default ProductForm;