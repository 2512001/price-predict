import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaStore, FaUser } from 'react-icons/fa';
import SearchResults from './SearchResults';
import { useSelector } from 'react-redux';
import { GrUserAdmin } from "react-icons/gr";
import { FiShoppingCart } from "react-icons/fi";
import '../styles/Navbar.css';

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items);



  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const user = useSelector((state) => state.userState.user);


  const navigate = useNavigate();


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) && !menuButtonRef.current.contains(event.target) // ✅ added this line
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setShowResults(false);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="home-icon">
          <FaStore />
          <span className="link-text">Iphone Store</span>
        </Link>

        <div ref={menuRef} className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/test-prediction">Test Prediction API</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <div className="cart-container cart-nav">
            <Link to="/cart" className="cart-link">
              Cart <FiShoppingCart className="cart-icon" />
              {cartItems?.length > 0 && (
                <span className="cart-count">{cartItems?.length}</span>
              )}
            </Link>
          </div>
          {user?.role == 'customer' ? (<Link to="/profile" className="profile-link">
            <FaUser className="profile-icon" />
            <span>
              {
                user?.name.length > 10 ? `${user?.name.substring(0  , 10)}...` : user?.name
              }
            </span>
          </Link>) : <Link to="/Admin" className="profile-link">
            <GrUserAdmin className="profile-icon" />
            <span>Admin</span>
          </Link>}

        </div>

        <div className="right-section">
          <form onSubmit={handleSearch}>
            <div className="search-container" ref={searchRef}>
              <input
                type="text"
                placeholder="Search iPhones..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
              />
              <FaSearch className="search-icon" cursor={'pointer'} onClick={handleSearch} />
              {showResults && (
                <SearchResults
                  searchQuery={searchQuery}
                  onClose={() => {
                    setShowResults(false);
                    setSearchQuery('');
                  }}
                />
              )}
            </div>
          </form>
        </div>

        <button className="menu-toggle" ref={menuButtonRef} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
