// File: /src/components/PerformanceAnalyzer/ElectiveRecommender.js

import React from 'react';
import './ElectiveRecommender.css';

const ElectiveRecommender = ({ recommendedElectives, studentData }) => {
  // Map of elective codes to names (temporary - should come from your data)
  const electiveNames = {
    "19-202-0507": "Machine Learning",
    "19-202-0606": "Neural Networks and Deep Learning",
    "19-202-0802": "Big Data Analytics",
    "19-202-0505": "Advanced Microprocessors and Microcontrollers",
    "19-202-0806": "Cloud Computing",
    "19-202-0810": "High Performance Embedded Computing"
  };

  return (
    <div className="elective-recommender">
      {recommendedElectives && recommendedElectives.length > 0 ? (
        <div className="elective-list">
          {recommendedElectives.map((electiveCode, index) => (
            <div key={`elective-${index}`} className="elective-card">
              <h4 className="elective-name">{electiveNames[electiveCode] || `Elective ${electiveCode}`}</h4>
              <div className="elective-code">{electiveCode}</div>
              <div className="elective-match">85% match with your skills</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-electives">
          <p>No elective recommendations available yet. Complete more core courses to receive personalized recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default ElectiveRecommender;