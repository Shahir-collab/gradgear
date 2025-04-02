// src/components/performance/RecommendedElectives.js
import React from 'react';
import './RecommendedElectives.css';

const RecommendedElectives = ({ electives }) => {
  if (!electives || electives.length === 0) {
    return null;
  }

  return (
    <div className="recommended-electives">
      <h2>Recommended Electives</h2>
      <div className="electives-container">
        {electives.map((elective, index) => (
          <div className="elective-card" key={index}>
            <div className="elective-match-indicator">
              <div 
                className="match-bar" 
                style={{ height: `${elective.match_percentage}%` }}
              ></div>
            </div>
            
            <div className="elective-details">
              <h3>{elective.subject_name}</h3>
              <p className="elective-code">{elective.subject_code}</p>
              <p className="match-percentage">{elective.match_percentage}% match with your skills</p>
              <p className="elective-credits">Credits: {elective.credits}</p>
              <p className="elective-description">{elective.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedElectives;