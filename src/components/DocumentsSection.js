import React from 'react';
import './DocumentsSection.css';
import { FaExternalLinkAlt } from 'react-icons/fa';

const DocumentsSection = () => {
  const documents = [
    { title: 'DS Handbook', color: '#6c63ff' },
    { title: 'DS Grading Doc', color: '#6c63ff' },
    { title: 'ES Handbook', color: '#6c63ff' },
    { title: 'ES Grading Doc', color: '#6c63ff' },
    { title: 'Financial Report', color: '#6c63ff' },
    { title: 'Privacy Policy', color: '#6c63ff' }
  ];

  return (
    <div className="documents-section">
      <h3 className="documents-title">Important Documents <span className="arrow">→</span></h3>
      <div className="document-links">
        {documents.map((doc, index) => (
          <a href="#" className="document-link" style={{ backgroundColor: doc.color }} key={index}>
            {doc.title} <FaExternalLinkAlt />
          </a>
        ))}
      </div>
    </div>
  );
};

export default DocumentsSection;