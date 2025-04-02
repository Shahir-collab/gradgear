// src/pages/GradeGaragePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradeGarageForm from '../components/GradeGarage/GradeGarageForm';
import SubjectSelector from '../components/GradeGarage/SubjectSelector';
import MarksList from '../components/GradeGarage/MarksList';
import './GradeGaragePage.css';

const GradeGaragePage = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentMarks, setCurrentMarks] = useState(null);

  // Simulated authentication check - replace with your actual auth logic
  useEffect(() => {
    const checkAuth = () => {
      // This would be your actual auth check
      const auth = localStorage.getItem('user') !== null;
      setIsAuthenticated(auth);
      setIsLoading(false);
      
      // If not authenticated, redirect to login
      if (!auth) {
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch subjects - replace with your actual API call
  useEffect(() => {
    if (isAuthenticated) {
      // This would be your actual API call
      const fetchSubjects = async () => {
        try {
          // Replace with actual API call
          // const response = await fetch('/api/subjects');
          // const data = await response.json();
          
          // Simulated data
          const data = [
            { id: '1', name: 'Data Structures and Algorithms', code: 'CSE101', semester: 3 },
            { id: '2', name: 'Database Management Systems', code: 'CSE201', semester: 3 },
            { id: '3', name: 'Operating Systems', code: 'CSE301', semester: 4 },
            { id: '4', name: 'Computer Networks', code: 'CSE401', semester: 4 }
          ];
          
          setSubjects(data);
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      };
      
      fetchSubjects();
    }
  }, [isAuthenticated]);

  // Fetch marks for the user - replace with your actual API call
  useEffect(() => {
    if (isAuthenticated) {
      // This would be your actual API call
      const fetchMarks = async () => {
        try {
          // Replace with actual API call
          // const response = await fetch('/api/marks');
          // const data = await response.json();
          
          // Simulated data
          const data = [
            { 
              id: '1', 
              subjectId: '1', 
              firstInternal: 25, 
              secondInternal: 28, 
              attendance: 92, 
              assignment: 14, 
              external: 58,
              totalMarks: 85,
              grade: 'A'
            },
            { 
              id: '2', 
              subjectId: '2', 
              firstInternal: 22, 
              secondInternal: 24, 
              attendance: 88, 
              assignment: 13, 
              external: 52,
              totalMarks: 78,
              grade: 'B'
            }
          ];
          
          setMarks(data);
        } catch (error) {
          console.error('Error fetching marks:', error);
        }
      };
      
      fetchMarks();
    }
  }, [isAuthenticated]);

  // Handle subject selection
  const handleSelectSubject = (subjectId) => {
    setSelectedSubject(subjectId);
    const existingMarks = marks.find(mark => mark.subjectId === subjectId);
    setCurrentMarks(existingMarks || null);
    setShowForm(true);
  };

  // Handle form submission
  const handleSaveMarks = async (formData) => {
    try {
      // Determine if we're updating or creating new marks
      const isUpdate = currentMarks !== null;
      
      // This would be your actual API call
      // const url = isUpdate ? `/api/marks/${currentMarks.id}` : '/api/marks';
      // const method = isUpdate ? 'PUT' : 'POST';
      // const response = await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();
      
      // Simulated response
      const data = {
        ...formData,
        id: currentMarks ? currentMarks.id : Date.now().toString(),
        totalMarks: calculateTotal(formData),
        grade: calculateGrade(formData)
      };
      
      // Update local state
      if (isUpdate) {
        setMarks(marks.map(mark => mark.id === data.id ? data : mark));
      } else {
        setMarks([...marks, data]);
      }
      
      // Reset form
      setShowForm(false);
      setCurrentMarks(null);
      setSelectedSubject('');
    } catch (error) {
      console.error('Error saving marks:', error);
    }
  };

  // Helper function to calculate total marks
  const calculateTotal = (data) => {
    return (
      (data.firstInternal || 0) + 
      (data.secondInternal || 0) + 
      (data.assignment || 0) + 
      (data.external || 0)
    );
  };

  // Helper function to calculate grade
  const calculateGrade = (data) => {
    const total = calculateTotal(data);
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B+';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 40) return 'D';
    return 'F';
  };

  // Handle adding new marks
  const handleAddNewMarks = () => {
    setCurrentMarks(null);
    setSelectedSubject('');
    setShowForm(true);
  };

  // Handle edit marks
  const handleEditMarks = (markId) => {
    const markToEdit = marks.find(mark => mark.id === markId);
    if (markToEdit) {
      setCurrentMarks(markToEdit);
      setSelectedSubject(markToEdit.subjectId);
      setShowForm(true);
    }
  };

  // Handle delete marks
  const handleDeleteMarks = async (markId) => {
    if (window.confirm('Are you sure you want to delete these marks?')) {
      try {
        // This would be your actual API call
        // await fetch(`/api/marks/${markId}`, { method: 'DELETE' });
        
        // Update local state
        setMarks(marks.filter(mark => mark.id !== markId));
        
        // Reset form if the deleted mark was being edited
        if (currentMarks && currentMarks.id === markId) {
          setShowForm(false);
          setCurrentMarks(null);
          setSelectedSubject('');
        }
      } catch (error) {
        console.error('Error deleting marks:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="grade-garage-container">
      <h1>GradeGarage</h1>
      <p className="description">Store and track your academic performance across all subjects</p>
      
      <div className="grade-garage-content">
        <div className="grade-garage-sidebar">
          <button 
            className="add-marks-btn" 
            onClick={handleAddNewMarks}
          >
            Add New Marks
          </button>
          
          <SubjectSelector 
            subjects={subjects} 
            selectedSubject={selectedSubject}
            onSelectSubject={handleSelectSubject}
          />
        </div>
        
        <div className="grade-garage-main">
          {showForm ? (
            <GradeGarageForm 
              subjects={subjects}
              selectedSubject={selectedSubject}
              initialData={currentMarks}
              onSave={handleSaveMarks}
              onCancel={() => {
                setShowForm(false);
                setCurrentMarks(null);
              }}
            />
          ) : (
            <MarksList 
              marks={marks} 
              subjects={subjects}
              onEdit={handleEditMarks}
              onDelete={handleDeleteMarks}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeGaragePage;