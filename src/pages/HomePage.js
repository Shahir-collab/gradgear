import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaSignOutAlt } from 'react-icons/fa';
import './HomePage.css';

const Dashboard = () => {
  // Authentication state management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Check authentication status on component mount
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (authToken && userInfo) {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Handle logout functionality
  const handleSignOut = (e) => {
    e.preventDefault();
    
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    
    // Update state
    setIsAuthenticated(false);
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <div className="home-page-container">
      <div className="home-page-overlay"></div>
      
      <div className="dashboard">
        <nav className="main-nav">
          <div className="nav-container">
            <div className="nav-brand">
              <Link to="/" className="brand-link">
                <span className="brand-icon">GG</span>
                <span className="brand-name">GradeGear</span>
              </Link>
            </div>
            
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/lectures">Lectures</Link>
              <Link to="/notes">Notes</Link>
              <Link to="/pyq">PYQ</Link>
              <Link to="/calculator">Calculator</Link>
              <Link to="/predictor">Predictor</Link>
              <Link to="/gg">GradeGarage</Link>
              <Link to="/groups">Groups</Link>
              <div className="dropdown">
  <button className="dropdown-toggle">
    Tools 
  </button>
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
    <Link to="/performance-analyzer" className="dropdown-item highlight-link">
      Performance Analyzer
    </Link>
  </div>
</div>
              <Link to="/about">About</Link>
            </div>
            
            <div className="nav-auth">
              {isAuthenticated ? (
                <Link to="/" onClick={handleSignOut} className="login-btn signout-btn">
                  Sign Out
                </Link>
              ) : (
                <Link to="/login" className="login-btn">Log In</Link>
              )}
            </div>
          </div>
        </nav>
        
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="typewriter-text">Gear Your Academics with</span>
            <br />
            <span className="typewriter-text delayed">Collaboration and Innovation</span>
          </h1>
          
          <p className="hero-subtitle">
            Start your journey to smarter learning and academic success
          </p>
          
          {isAuthenticated ? (
            <Link to="/dashboard" className="cta-button">
              My Dashboard
              <span className="arrow-icon">
                <FaArrowRight />
              </span>
            </Link>
          ) : (
            <Link to="/login" className="cta-button">
              Get Started
              <span className="arrow-icon">
                <FaArrowRight />
              </span>
            </Link>
          )}
          
          <div className="hero-glow"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;