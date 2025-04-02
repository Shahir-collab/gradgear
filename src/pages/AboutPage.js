import React from 'react';
import Navbar from '../components/Navbar';

const AboutPage = ({ isAuthenticated, onLogout }) => {
  return (
    <div className="page">
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="page-content">
        <h1>About GradeGear</h1>
        <div className="about-content">
          <p>
            GradeGear is an academic platform designed specifically for CUSAT students
            to help them excel in their academic journey.
          </p>
          <h2>Our Mission</h2>
          <p>
            To provide a comprehensive suite of tools that simplify the academic
            experience and help students achieve their full potential.
          </p>
          <h2>Features</h2>
          <ul>
            <li>Access to lecture materials and notes</li>
            <li>Previous year question papers</li>
            <li>Grade calculation and prediction tools</li>
            <li>Quiz evaluation system</li>
            <li>Study groups for collaborative learning</li>
          </ul>
          <h2>Contact Us</h2>
          <p>
            If you have any questions or feedback, please contact us at:
            <br />
            <a href="mailto:support@gradegear.com">support@gradegear.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;