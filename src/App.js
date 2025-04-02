import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LecturesPage from './pages/LecturesPage';
import NotesPage from './pages/NotesPage';
import PYQPage from './pages/PYQPage';
import GradeCalculatorPage from './pages/GradeCalculatorPage';
import GradePredictorPage from './pages/GradePredictorPage';
import GradeGarage from './pages/GradeGarage';
import PerformanceAnalyzerPage from './pages/PerformanceAnalyzerPage'; // Import the new feature
import AboutPage from './pages/AboutPage';
import GroupsPage from './pages/GroupsPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to handle login success
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <GoogleOAuthProvider clientId="259016879-t3ge8dijto13up6nlvdn486dvgedmk4t.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
          <Route path="/login" element={
            isAuthenticated ? 
            <Navigate to="/" replace /> : 
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          } />
          <Route path="/lectures" element={
            isAuthenticated ? 
            <LecturesPage onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/notes" element={
            isAuthenticated ? 
            <NotesPage onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/pyq" element={
            isAuthenticated ? 
            <PYQPage onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/calculator" element={
            isAuthenticated ? 
            <GradeCalculatorPage onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/predictor" element={
            isAuthenticated ? 
            <GradePredictorPage onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/gg" element={
            isAuthenticated ? 
            <GradeGarage onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          {/* Add the new Performance Analyzer route with authentication protection */}
          <Route path="/performance-analyzer" element={
            isAuthenticated ? 
            <PerformanceAnalyzerPage onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/about" element={<AboutPage isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
          <Route path="/groups" element={
            isAuthenticated ? 
            <GroupsPage onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;