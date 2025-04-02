// src/components/performance/CareerPaths.js
import React from 'react';
import './CareerPaths.css';

const CareerPaths = ({ careerPaths }) => {
  if (!careerPaths || careerPaths.length === 0) {
    return null;
  }

  return (
    <div className="potential-career-paths">
      <h2>Potential Career Paths</h2>
      <div className="career-paths-container">
        {careerPaths.map((career, index) => (
          <div className="career-card" key={index}>
            <div className="career-header">
              <h3>{career.path_name}</h3>
              <div className="match-label">
                <span className="match-value">{career.match_percentage}%</span>
                <span className="match-text">Match</span>
              </div>
            </div>
            
            <p className="career-description">{career.description}</p>
            
            <div className="recommended-masters">
              <h4>Recommended Master's Programs</h4>
              <ul>
                {career.recommended_programs.map((program, idx) => (
                  <li key={idx}>
                    <strong>{program.program_name}</strong>
                    <p>{program.university}, {program.country}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerPaths;