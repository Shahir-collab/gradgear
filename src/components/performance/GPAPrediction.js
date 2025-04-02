// src/components/performance/GPAPrediction.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './GPAPrediction.css';

const GPAPrediction = ({ data }) => {
  if (!data) return <div>No GPA prediction data available</div>;
  
  const { actual_gpa, predicted_gpa, confidence_score } = data;
  
  // Combine actual and predicted data for chart
  const chartData = [];
  
  // Add actual GPA data
  actual_gpa.forEach(semester => {
    chartData.push({
      semester: `Semester ${semester.semester_number}`,
      actual: parseFloat(semester.cgpa),
      predicted: null
    });
  });
  
  // Add predicted GPA data
  predicted_gpa.forEach(semester => {
    chartData.push({
      semester: `Semester ${semester.semester_number}`,
      actual: null,
      predicted: parseFloat(semester.predicted_cgpa)
    });
  });
  
  return (
    <div className="gpa-prediction">
      <h2>GPA Prediction & Trajectory</h2>
      
      <div className="gpa-chart-container">
        <div className="prediction-header">
          <h3>GPA Trend & Prediction</h3>
          <div className="confidence-indicator">
            <span>Prediction Confidence:</span>
            <div className="confidence-bar-container">
              <div 
                className="confidence-bar" 
                style={{ width: `${confidence_score}%` }}
              ></div>
              <span className="confidence-value">{confidence_score}%</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semester" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#4CAF50" 
              strokeWidth={2}
              name="Actual GPA"
              connectNulls
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#FF9800" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted GPA"
              connectNulls
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="prediction-explanation">
          <h4>How this works:</h4>
          <p>
            This prediction uses a linear regression model based on your past semester performance to
            estimate future GPA trends. The confidence score indicates the reliability of the prediction
            based on the consistency of your past performance and the amount of data available.
          </p>
        </div>
      </div>
      
      <div className="gpa-improvement-tips">
        <h3>Tips to Improve Your GPA</h3>
        <ul>
          <li>
            <strong>Focus on weak subjects:</strong> Allocate more study time to subjects where you've scored lower.
          </li>
          <li>
            <strong>Consistent study schedule:</strong> Establish a regular study routine rather than cramming.
          </li>
          <li>
            <strong>Seek help early:</strong> Don't wait until exams to clarify concepts you don't understand.
          </li>
          <li>
            <strong>Practice with past papers:</strong> Familiarize yourself with the exam format and question styles.
          </li>
          <li>
            <strong>Balanced course load:</strong> Consider the difficulty level when selecting electives.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GPAPrediction;