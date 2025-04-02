import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaChevronDown, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import kathakaliLogo from '../assets/logo.png';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Determine if the current path is in the Tools dropdown
  const isToolActive = () => {
    const toolPaths = ['/calculator', '/predictor', '/gradegarage', '/gg', '/performance-analyzer'];
    return toolPaths.includes(location.pathname);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={kathakaliLogo} alt="GradeGear Logo" className="kathakali-logo" />
          <span>GradeGear</span>
        </Link>
        
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/lectures" className={`nav-link ${location.pathname === '/lectures' ? 'active' : ''}`}>Lectures</Link>
          <Link to="/notes" className={`nav-link ${location.pathname === '/notes' ? 'active' : ''}`}>Notes</Link>
          <Link to="/pyq" className={`nav-link ${location.pathname === '/pyq' ? 'active' : ''}`}>Resources</Link>
          <Link to="/groups" className={`nav-link ${location.pathname === '/groups' ? 'active' : ''}`}>Community</Link>
          
          <div className="nav-item dropdown">
            <span className={`nav-link dropdown-toggle ${isToolActive() ? 'active' : ''}`}>
              Tools <FaChevronDown className="dropdown-icon" />
            </span>
            <div className="dropdown-menu">
              <Link to="/calculator" className="dropdown-item">
                Grade Calculator
              </Link>
              <Link to="/predictor" className="dropdown-item">
                Grade Predictor
              </Link>
              <Link to="/gg" className="dropdown-item">
                GradeGarage
              </Link>
              <Link to="/performance-analyzer" className="dropdown-item highlight-item">
                Performance Analyzer
              </Link>
            </div>
          </div>
          
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About Us</Link>
        </div>
        
        <div className="navbar-auth">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="auth-button logout-button">
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="auth-button login-button">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;