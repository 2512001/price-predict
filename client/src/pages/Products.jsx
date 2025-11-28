import { useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/Products.css';
import { useQuery } from '@tanstack/react-query';
import { getpageCount, getProducts } from '../Api/api';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function Query() {
  return new URLSearchParams(useLocation().search);
}

const Products = () => {
  const query = Query();
  const search = query.get('search');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);



  const { data: { pageCount = 0, products = [] } = {}, isLoading: isProductloading } = useQuery({
    queryKey: ['products', search || '', sortBy, currentPage],
    queryFn: () => getProducts({ search, sortBy, page: currentPage }),
    keepPreviousData: true,
  });
  

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>📱 iPhone Collection</h1>
        <div className="products-filters">
          <div className="filter-group">
            <label htmlFor="filter">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All iPhones</option>
              <option value="pro">Pro Models</option>
              <option value="regular">Regular Models</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>


      <div className="products-grid">
        {isProductloading ? (
          // Render 6 skeleton cards to simulate loading state
          [...Array(6)].map((_, i) => (
            <div className="product-card" key={i}>
              <div className="img-container">
                <Skeleton height={180} width="100%" />
              </div>

              <div className="info">
                <h2><Skeleton width="80%" /></h2>

                <div className="price-wrapper">
                  <Skeleton width="40%" />
                  <Skeleton width="30%" />
                  <Skeleton width="20%" />
                </div>

                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} circle width={20} height={20} style={{ marginRight: 5 }} />
                  ))}
                </div>

                <div className="actions">
                  <Skeleton height={30} width="45%" style={{ marginRight: 10 }} />
                  <Skeleton height={30} width="45%" />
                </div>
              </div>
            </div>
          ))
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="no-results">
            <p>No products found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <button className="pagination-btn"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          style={{
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >−</button>

        <div className="pagination-input">
          <input
            type="number"
            min="1"
            defaultValue={1}
            value={currentPage}
          />
          <span className="total-pages">/ {pageCount}</span>
        </div>

        <button className="pagination-btn"
          onClick={() => setCurrentPage(prev => {
            if (prev < pageCount) {
              return prev + 1;
            }
            return prev;
          })}
          disabled={currentPage === pageCount}
          style={{
            cursor: currentPage === pageCount ? "not-allowed" : "pointer",
            opacity: currentPage === pageCount ? 0.5 : 1,
          }}
        >+</button>
      </div>

    </div>
  );
};

export default Products;
