// src/components/performance/AnalysisNavigation.js
import React from 'react';
import './AnalysisNavigation.css';

const AnalysisNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="analysis-navigation">
      <button 
        className={`nav-button ${activeTab === 'skill' ? 'active' : ''}`}
        onClick={() => setActiveTab('skill')}
      >
        Skill Analysis
      </button>
      <button 
        className={`nav-button ${activeTab === 'subject' ? 'active' : ''}`}
        onClick={() => setActiveTab('subject')}
      >
        Subject Analysis
      </button>
      <button 
        className={`nav-button ${activeTab === 'gpa' ? 'active' : ''}`}
        onClick={() => setActiveTab('gpa')}
      >
        GPA Prediction
      </button>
    </div>
  );
};

export default AnalysisNavigation;