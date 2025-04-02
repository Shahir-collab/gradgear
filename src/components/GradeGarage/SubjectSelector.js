// src/components/GradeGarage/SubjectSelector.js
import React from 'react';
import './SubjectSelector.css';

const SubjectSelector = ({ subjects, selectedSubject, onSelectSubject }) => {
  return (
    <div className="subject-selector">
      <h3>My Subjects</h3>
      <div className="subjects-list">
        {subjects.length > 0 ? (
          subjects.map(subject => (
            <div 
              key={subject.id}
              className={`subject-item ${selectedSubject === subject.id ? 'selected' : ''}`}
              onClick={() => onSelectSubject(subject.id)}
            >
              <div className="subject-name">{subject.name}</div>
              <div className="subject-code">{subject.code}</div>
              <div className="subject-semester">Semester {subject.semester}</div>
            </div>
          ))
        ) : (
          <div className="no-subjects">No subjects available</div>
        )}
      </div>
    </div>
  );
};

export default SubjectSelector;