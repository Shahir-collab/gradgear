import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [error, setError] = useState('');

  const handleGoogleLoginSuccess = (credentialResponse) => {
    try {
      // Decode the JWT token from Google
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name, picture } = decoded;
      
      console.log('Decoded email:', email); // Debug log
      
      // Check if email is from CUSAT domain
      if (!email.toLowerCase().endsWith('@ug.cusat.ac.in')) {
        setError('Please use your CUSAT email address (@ug.cusat.ac.in) to login');
        return;
      }
      
      // Store auth info in localStorage
      localStorage.setItem('authToken', credentialResponse.credential);
      localStorage.setItem('userInfo', JSON.stringify({ email, name, picture }));
      
      console.log('CUSAT login successful');
      
      // Call the login success handler from props
      onLoginSuccess();
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <nav className="login-navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">GG</span>
            <span className="brand-name">GradeGear</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
          </div>
        </div>
      </nav>

      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </div>
          
          <h1 className="login-title">Sign in with CUSAT email id</h1>
          <p className="login-subtitle">Continue your journey towards academic excellence.</p>
          
          {error && <div className="login-error">{error}</div>}
          
          <div className="login-button-container">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                console.log('Login Failed');
                setError('Google login failed. Please try again.');
              }}
              useOneTap
              shape="pill"
              theme="filled_black"
              text="signin_with"
              size="large"
              logo_alignment="center"
              width="100%"
            />
          </div>
          
          <div className="login-note">
            <p><strong>Note:</strong> Only CUSAT email addresses (@ug.cusat.ac.in) are allowed for login.</p>
          </div>

          <div className="login-footer">
            <p>By signing in, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
          </div>
        </div>
      </div>
      
      <div className="login-background-glow"></div>
    </div>
  );
};

export default LoginPage;