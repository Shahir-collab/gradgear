import React from 'react';
import { Link } from 'react-router-dom';
import './FeatureTiles.css';
import { FaLaptop, FaEdit, FaFileAlt, FaCalculator, FaChartLine, FaQuestionCircle, FaUsers } from 'react-icons/fa';

const FeatureTiles = () => {
  const features = [
    { icon: <FaLaptop />, title: 'Lectures', path: '/lectures' },
    { icon: <FaEdit />, title: 'Notes', path: '/notes' },
    { icon: <FaFileAlt />, title: 'PYQ', path: '/pyq' },
    { icon: <FaCalculator />, title: 'Grade Calculator', path: '/calculator' },
    { icon: <FaQuestionCircle />, title: 'Quiz Evaluator', path: '/evaluator' },
    { icon: <FaChartLine />, title: 'Grade Predictor', path: '/predictor' },
    { icon: <FaUsers />, title: 'Groups', path: '/groups' }
  ];

  return (
    <div className="feature-tiles">
      {features.map((feature, index) => (
        <Link to={feature.path} className="feature-tile" key={index}>
          <div className="feature-icon">{feature.icon}</div>
          <div className="feature-title">{feature.title}</div>
        </Link>
      ))}
    </div>
  );
};

export default FeatureTiles;