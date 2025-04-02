import React from 'react';
import './HeroSection.css';
import studyIllustration from '../assets/study-illustration.svg';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">GradeGear</h1>
        <div className="hero-text">
          <p>Elevate your Academic journey with our website!</p>
          <p>Find notes, past question papers, and essential tools to excel academically.</p>
          <p>Join thousands of students who trust us as their go-to resource hub. Take the next step towards success today!</p>
        </div>
      </div>
      <div className="hero-image">
        <div className="logo-placeholder">
          <div className="logo-square gray"></div>
          <div className="logo-square blue"></div>
          <div className="logo-square pink"></div>
        </div>
        <img src={studyIllustration} alt="Student studying" />
      </div>
    </div>
  );
};

export default HeroSection;