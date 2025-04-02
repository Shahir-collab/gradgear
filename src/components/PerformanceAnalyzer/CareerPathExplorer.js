// File: /src/components/PerformanceAnalyzer/CareerPathExplorer.js

import React from 'react';
import './CareerPathExplorer.css';

const CareerPathExplorer = ({ careerPaths }) => {
  return (
    <div className="career-path-explorer">
      {careerPaths && careerPaths.length > 0 ? (
        <div className="career-paths-container">
          {careerPaths.map((path, index) => (
            <div key={`career-${index}`} className="career-card">
              <div className="career-header">
                <h3>{path.career}</h3>
                <div className="match-indicator">
                  <div className="match-percentage">{Math.round(path.matchPercentage)}%</div>
                  <div className="match-label">Match</div>
                </div>
              </div>
              
              <div className="masters-recommendations">
                <h4>Recommended Master's Programs</h4>
                <ul>
                  {path.recommendedMasters.map((program, pIndex) => (
                    <li key={`masters-${index}-${pIndex}`}>{program}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-career-paths">
          <p>Complete more courses to receive career path recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default CareerPathExplorer;