// src/components/GradeGarage/GradeGarageForm.js
import React, { useState, useEffect } from 'react';
import './GradeGarageForm.css';

const GradeGarageForm = ({ subjects, selectedSubject, initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    subjectId: selectedSubject || '',
    firstInternal: '',
    secondInternal: '',
    attendance: '',
    assignment: '',
    external: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Initialize form with initial data if available
  useEffect(() => {
    if (initialData) {
      setFormData({
        subjectId: initialData.subjectId || selectedSubject || '',
        firstInternal: initialData.firstInternal || '',
        secondInternal: initialData.secondInternal || '',
        attendance: initialData.attendance || '',
        assignment: initialData.assignment || '',
        external: initialData.external || ''
      });
    } else {
      setFormData({
        subjectId: selectedSubject || '',
        firstInternal: '',
        secondInternal: '',
        attendance: '',
        assignment: '',
        external: ''
      });
    }
  }, [initialData, selectedSubject]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subjectId) {
      newErrors.subjectId = 'Please select a subject';
    }
    
    if (formData.firstInternal && (isNaN(formData.firstInternal) || formData.firstInternal < 0 || formData.firstInternal > 30)) {
      newErrors.firstInternal = 'First internal should be between 0 and 30';
    }
    
    if (formData.secondInternal && (isNaN(formData.secondInternal) || formData.secondInternal < 0 || formData.secondInternal > 30)) {
      newErrors.secondInternal = 'Second internal should be between 0 and 30';
    }
    
    if (formData.attendance && (isNaN(formData.attendance) || formData.attendance < 0 || formData.attendance > 100)) {
      newErrors.attendance = 'Attendance should be between 0 and 100';
    }
    
    if (formData.assignment && (isNaN(formData.assignment) || formData.assignment < 0 || formData.assignment > 15)) {
      newErrors.assignment = 'Assignment should be between 0 and 15';
    }
    
    if (formData.external && (isNaN(formData.external) || formData.external < 0 || formData.external > 60)) {
      newErrors.external = 'External should be between 0 and 60';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert string values to numbers
      const processedData = {
        ...formData,
        firstInternal: formData.firstInternal ? parseFloat(formData.firstInternal) : 0,
        secondInternal: formData.secondInternal ? parseFloat(formData.secondInternal) : 0,
        attendance: formData.attendance ? parseFloat(formData.attendance) : 0,
        assignment: formData.assignment ? parseFloat(formData.assignment) : 0,
        external: formData.external ? parseFloat(formData.external) : 0
      };
      
      // If editing, include the ID
      if (initialData && initialData.id) {
        processedData.id = initialData.id;
      }
      
      onSave(processedData);
    }
  };
  
  // Get selected subject name
  const getSubjectName = () => {
    const subject = subjects.find(s => s.id === formData.subjectId);
    return subject ? subject.name : 'Select Subject';
  };
  
  return (
    <div className="grade-garage-form">
      <h2>{initialData ? 'Edit Marks' : 'Add New Marks'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subject</label>
          <select 
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            className={errors.subjectId ? 'error' : ''}
          >
            <option value="">Select Subject</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name} ({subject.code})
              </option>
            ))}
          </select>
          {errors.subjectId && <div className="error-message">{errors.subjectId}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>First Internal Test (out of 30)</label>
            <input 
              type="number"
              name="firstInternal"
              value={formData.firstInternal}
              onChange={handleChange}
              placeholder="Enter marks (0-30)"
              min="0"
              max="30"
              className={errors.firstInternal ? 'error' : ''}
            />
            {errors.firstInternal && <div className="error-message">{errors.firstInternal}</div>}
          </div>
          
          <div className="form-group">
            <label>Second Internal Test (out of 30)</label>
            <input 
              type="number"
              name="secondInternal"
              value={formData.secondInternal}
              onChange={handleChange}
              placeholder="Enter marks (0-30)"
              min="0"
              max="30"
              className={errors.secondInternal ? 'error' : ''}
            />
            {errors.secondInternal && <div className="error-message">{errors.secondInternal}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Attendance Percentage (%)</label>
            <input 
              type="number"
              name="attendance"
              value={formData.attendance}
              onChange={handleChange}
              placeholder="Enter percentage (0-100)"
              min="0"
              max="100"
              className={errors.attendance ? 'error' : ''}
            />
            {errors.attendance && <div className="error-message">{errors.attendance}</div>}
          </div>
          
          <div className="form-group">
            <label>Assignment Marks (out of 15)</label>
            <input 
              type="number"
              name="assignment"
              value={formData.assignment}
              onChange={handleChange}
              placeholder="Enter marks (0-15)"
              min="0"
              max="15"
              className={errors.assignment ? 'error' : ''}
            />
            {errors.assignment && <div className="error-message">{errors.assignment}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label>External Exam Marks (out of 60)</label>
          <input 
            type="number"
            name="external"
            value={formData.external}
            onChange={handleChange}
            placeholder="Enter marks (0-60)"
            min="0"
            max="60"
            className={errors.external ? 'error' : ''}
          />
          {errors.external && <div className="error-message">{errors.external}</div>}
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            {initialData ? 'Update Marks' : 'Save Marks'}
          </button>
        </div>
      </form>
    </div>
  );
};
   // Add this code to your GradeGarage component where grades are saved
   
   import axios from 'axios';
   
   const saveGradeAndUpdateAnalysis = async (subjectData) => {
     try {
       // Step 1: Save the grade data
       const saveResponse = await axios.post('/api/semesters/subjects', subjectData, {
         headers: {
           'Authorization': `Bearer ${localStorage.getItem('token')}`
         }
       });
       
       // Step 2: Trigger the performance analysis update
       if (saveResponse.status === 200) {
         await axios.post('/api/performance/recalculate', {}, {
           headers: {
             'Authorization': `Bearer ${localStorage.getItem('token')}`
           }
         });
         
         // Show success notification
         showNotification('Grade saved and performance analysis updated');
       }
     } catch (error) {
       console.error('Error saving grade data:', error);
       showNotification('Failed to save grade data', 'error');
     }
   };
   // In your GradeGarage component
   
   <div className="grade-garage-header">
     <h1>GradeGarage</h1>
     <p>Store and track your academic performance across semesters</p>
     
     {/* Add this button */}
     <button 
       className="analyze-performance-button"
       onClick={() => navigate('/performance-analyzer')}
     >
       Analyze My Performance
     </button>
   </div>


export default GradeGarageForm;