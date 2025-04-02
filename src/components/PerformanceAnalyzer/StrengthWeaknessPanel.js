// File: /src/components/PerformanceAnalyzer/StrengthWeaknessPanel.js

import React from 'react';
import './StrengthWeaknessPanel.css';

const StrengthWeaknessPanel = ({ strengths, weaknesses }) => {
  // Format skill name for display
  const formatSkillName = (skill) => {
    return skill
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="strength-weakness-panel">
      <div className="panel-section strengths-section">
        <h3>Your Strengths</h3>
        {strengths.length > 0 ? (
          <ul className="skill-list">
            {strengths.map((strength, index) => (
              <li key={`strength-${index}`} className="skill-item">
                <span className="skill-name">{formatSkillName(strength.skill)}</span>
                <span className="skill-score">{strength.score.toFixed(1)}/10</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">Complete more courses to identify your strengths</p>
        )}
      </div>
      
      <div className="panel-section weaknesses-section">
        <h3>Areas for Improvement</h3>
        {weaknesses.length > 0 ? (
          <ul className="skill-list">
            {weaknesses.map((weakness, index) => (
              <li key={`weakness-${index}`} className="skill-item">
                <span className="skill-name">{formatSkillName(weakness.skill)}</span>
                <span className="skill-score">{weakness.score.toFixed(1)}/10</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">Complete more courses to identify areas for improvement</p>
        )}
      </div>
    </div>
  );
};

export default StrengthWeaknessPanel;