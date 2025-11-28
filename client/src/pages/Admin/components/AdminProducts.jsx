import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getProducts } from '../../../Api/api';

const AdminProducts = ({ Adminproducts }) => {

  const [search, setSearchTerm] = useState('');
  const [page , setpage] = useState(1);


  const { data: { products = [] , pageCount } = {}, isLoading } = useQuery({
    queryKey: ['products', search || ''],
    queryFn: () => getProducts(),
  });

  


  return (
    <div className="Adminproducts-section">
      <div className="Adminproducts-header">
        <h2>Manage AdminProducts</h2>
        <div className="Adminproducts-filters">
          <input type="text" value={search} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Adminproducts..." />
          <select>
            <option value="all">All Categories</option>
            <option value="mobile">Mobile</option>
            <option value="electronics">Electronics</option>
          </select>
        </div>
      </div>

      <div className="Adminproducts-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            {products?.map(Adminproduct => (
              <tr key={Adminproduct._id}>
                <td>
                  <img src={Adminproduct.images[0]} alt={Adminproduct.name} />
                </td>
                <td>{Adminproduct.name}</td>
                <td>{Adminproduct.category}</td>
                <td>${Adminproduct.price}</td>
                <td>{Adminproduct.stock}</td>
                <td>
                  <span className={`status ${Adminproduct.isActive ? 'active' : 'inactive'}`}>
                    {Adminproduct.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts; 