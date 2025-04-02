// src/components/GradeGarage/MarksList.js
import React from 'react';
import './MarksList.css';

const MarksList = ({ marks, subjects, onEdit, onDelete }) => {
  // Helper function to get subject name
  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };
  
  // Calculate total and determine grade color
  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+':
      case 'A':
        return 'grade-a';
      case 'B+':
      case 'B':
        return 'grade-b';
      case 'C':
        return 'grade-c';
      case 'D':
        return 'grade-d';
      default:
        return 'grade-f';
    }
  };
  
  return (
    <div className="marks-list">
      <h2>My Academic Performance</h2>
      
      {marks.length > 0 ? (
        <div className="marks-cards">
          {marks.map(mark => (
            <div className="mark-card" key={mark.id}>
              <div className="mark-header">
                <h3>{getSubjectName(mark.subjectId)}</h3>
                <div className={`grade-badge ${getGradeColor(mark.grade)}`}>
                  {mark.grade}
                </div>
              </div>
              
              <div className="mark-details">
                <div className="mark-item">
                  <span className="mark-label">First Internal:</span>
                  <span className="mark-value">{mark.firstInternal}/30</span>
                </div>
                <div className="mark-item">
                  <span className="mark-label">Second Internal:</span>
                  <span className="mark-value">{mark.secondInternal}/30</span>
                </div>
                <div className="mark-item">
                  <span className="mark-label">Attendance:</span>
                  <span className="mark-value">{mark.attendance}%</span>
                </div>
                <div className="mark-item">
                  <span className="mark-label">Assignment:</span>
                  <span className="mark-value">{mark.assignment}/15</span>
                </div>
                <div className="mark-item">
                  <span className="mark-label">External:</span>
                  <span className="mark-value">{mark.external}/60</span>
                </div>
                <div className="mark-item total">
                  <span className="mark-label">Total:</span>
                  <span className="mark-value">{mark.totalMarks}/135</span>
                </div>
              </div>
              
              <div className="mark-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => onEdit(mark.id)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => onDelete(mark.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-marks">
          <p>You haven't added any marks yet.</p>
          <p>Use the "Add New Marks" button to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MarksList;