import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSave, FaUndo } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import './GradeGarage.css';

const GradeGarage = ({ onLogout }) => {
  const [semesters, setSemesters] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // CSE subjects by semester
  const cseSubjects = {
    'Semester 1': [
      'Engineering Mathematics I', 
      'Engineering Physics', 
      'Engineering Chemistry', 
      'Engineering Graphics', 
      'Introduction to Computing and Problem Solving',
      'Engineering Mechanics',
      'Professional Communication'
    ],
    'Semester 2': [
      'Engineering Mathematics II',
      'Data Structures',
      'Discrete Computational Structures',
      'Programming Paradigms',
      'Digital System Design',
      'Sustainable Engineering'
    ],
    'Semester 3': [
      'Engineering Mathematics III',
      'Logic System Design',
      'Object Oriented Programming',
      'Principles of Programming Languages',
      'Data Communication',
      'Logic System Design Lab',
      'Programming Lab'
    ],
    'Semester 4': [
      'Engineering Mathematics IV',
      'Computer Organization and Architecture',
      'Database Management Systems',
      'Operating Systems',
      'Theory of Computation',
      'Database Management Systems Lab',
      'Operating Systems Lab'
    ],
    'Semester 5': [
      'Computer Networks',
      'System Software',
      'Microprocessors and Microcontrollers',
      'Formal Languages and Automata Theory',
      'Software Engineering',
      'Networks Lab',
      'Microprocessor Lab'
    ],
    'Semester 6': [
      'Compiler Design',
      'Computer Graphics and Multimedia',
      'Design and Analysis of Algorithms',
      'Web Technologies',
      'Elective I',
      'Compiler Design Lab',
      'Web Technologies Lab'
    ],
    'Semester 7': [
      'Distributed Systems',
      'Information Security',
      'Machine Learning',
      'Elective II',
      'Elective III',
      'Project Design',
      'Seminar'
    ],
    'Semester 8': [
      'Elective IV',
      'Project Implementation',
      'Viva Voce'
    ]
  };

  // Grade mapping for CUSAT grading system
  const gradeMapping = {
    S: { min: 90, max: 100, points: 10 },
    A: { min: 85, max: 89.99, points: 9 },
    B: { min: 80, max: 84.99, points: 8 },
    C: { min: 70, max: 79.99, points: 7 },
    D: { min: 60, max: 69.99, points: 6 },
    E: { min: 50, max: 59.99, points: 5 },
    F: { min: 0, max: 49.99, points: 0 }
  };

  // Load user data and saved semesters
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get user data from localStorage or your backend
        const token = localStorage.getItem('authToken');
        const userInfo = localStorage.getItem('userInfo');
        
        if (token && userInfo) {
          const userData = JSON.parse(userInfo);
          setUserData(userData);
          
          // Load saved semesters from localStorage
          const savedSemesters = localStorage.getItem(`gradeGarage_${userData.email}`);
          if (savedSemesters) {
            setSemesters(JSON.parse(savedSemesters));
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load your academic records');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save semesters to localStorage whenever they change
  useEffect(() => {
    if (userData && semesters.length > 0) {
      localStorage.setItem(`gradeGarage_${userData.email}`, JSON.stringify(semesters));
    }
  }, [semesters, userData]);

  const addSemester = () => {
    // Get the next semester number
    const nextSemesterNumber = semesters.length + 1;
    if (nextSemesterNumber > 8) {
      setError('Maximum of 8 semesters allowed');
      return;
    }
    
    const semesterName = `Semester ${nextSemesterNumber}`;
    
    const newSemester = {
      id: Date.now().toString(),
      name: semesterName,
      number: nextSemesterNumber,
      createdAt: new Date().toISOString(),
      subjects: [],
      isAddingSubject: false,
      newSubject: { name: '', marks: '', credits: 3 }
    };
    
    setSemesters([...semesters, newSemester]);
    setError('');
  };

  const deleteSemester = (semesterId) => {
    if (window.confirm('Are you sure you want to delete this semester? This action cannot be undone.')) {
      setSemesters(semesters.filter(semester => semester.id !== semesterId));
    }
  };

  const toggleAddSubject = (semesterId) => {
    setSemesters(semesters.map(semester => 
      semester.id === semesterId 
        ? { ...semester, isAddingSubject: !semester.isAddingSubject }
        : semester
    ));
  };

  const handleNewSubjectChange = (semesterId, field, value) => {
    setSemesters(semesters.map(semester => 
      semester.id === semesterId 
        ? { 
            ...semester, 
            newSubject: { 
              ...semester.newSubject, 
              [field]: value 
            } 
          }
        : semester
    ));
  };

  const addSubject = (semesterId) => {
    const semester = semesters.find(s => s.id === semesterId);
    
    if (!semester.newSubject.name.trim() || !semester.newSubject.marks.trim()) {
      setError('Please enter both subject name and marks');
      return;
    }
    
    const marks = parseFloat(semester.newSubject.marks);
    const credits = parseFloat(semester.newSubject.credits);
    
    if (isNaN(marks) || marks < 0 || marks > 100) {
      setError('Marks must be a number between 0 and 100');
      return;
    }
    
    if (isNaN(credits) || credits <= 0) {
      setError('Credits must be a positive number');
      return;
    }
    
    // Calculate grade based on marks
    const grade = Object.keys(gradeMapping).find(grade => 
      marks >= gradeMapping[grade].min && marks <= gradeMapping[grade].max
    );
    
    const newSubject = {
      id: Date.now().toString(),
      name: semester.newSubject.name,
      marks,
      credits,
      grade,
      gradePoints: gradeMapping[grade].points,
      createdAt: new Date().toISOString(),
      isEditing: false
    };
    
    // Check if subject already exists
    if (semester.subjects.some(s => s.name === newSubject.name)) {
      setError('This subject already exists in this semester');
      return;
    }
    
    setSemesters(semesters.map(s => 
      s.id === semesterId 
        ? { 
            ...s, 
            subjects: [...s.subjects, newSubject],
            isAddingSubject: false,
            newSubject: { name: '', marks: '', credits: 3 }
          }
        : s
    ));
    
    setError('');
  };

  const toggleEditSubject = (semesterId, subjectId) => {
    setSemesters(semesters.map(semester => 
      semester.id === semesterId 
        ? { 
            ...semester, 
            subjects: semester.subjects.map(subject => 
              subject.id === subjectId 
                ? { ...subject, isEditing: !subject.isEditing }
                : subject
            )
          }
        : semester
    ));
  };

  const handleEditSubjectChange = (semesterId, subjectId, field, value) => {
    setSemesters(semesters.map(semester => 
      semester.id === semesterId 
        ? { 
            ...semester, 
            subjects: semester.subjects.map(subject => 
              subject.id === subjectId 
                ? { ...subject, [field]: value }
                : subject
            )
          }
        : semester
    ));
  };

  const updateSubject = (semesterId, subjectId) => {
    const semester = semesters.find(s => s.id === semesterId);
    const subject = semester.subjects.find(s => s.id === subjectId);
    
    if (!subject.name.trim() || isNaN(parseFloat(subject.marks))) {
      setError('Please enter both subject name and valid marks');
      return;
    }
    
    const marks = parseFloat(subject.marks);
    const credits = parseFloat(subject.credits);
    
    if (marks < 0 || marks > 100) {
      setError('Marks must be between 0 and 100');
      return;
    }
    
    if (credits <= 0) {
      setError('Credits must be a positive number');
      return;
    }
    
    // Calculate grade based on marks
    const grade = Object.keys(gradeMapping).find(grade => 
      marks >= gradeMapping[grade].min && marks <= gradeMapping[grade].max
    );
    
    setSemesters(semesters.map(s => 
      s.id === semesterId 
        ? { 
            ...s, 
            subjects: s.subjects.map(subj => 
              subj.id === subjectId 
                ? { 
                    ...subj, 
                    name: subject.name,
                    marks, 
                    credits, 
                    grade, 
                    gradePoints: gradeMapping[grade].points, 
                    updatedAt: new Date().toISOString(),
                    isEditing: false 
                  }
                : subj
            )
          }
        : s
    ));
    
    setError('');
  };

  const deleteSubject = (semesterId, subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSemesters(semesters.map(semester => 
        semester.id === semesterId 
          ? { 
              ...semester, 
              subjects: semester.subjects.filter(subject => subject.id !== subjectId)
            }
          : semester
      ));
    }
  };

  const calculateSGPA = (subjects) => {
    if (!subjects.length) return 'N/A';
    
    const totalCreditPoints = subjects.reduce((sum, subject) => 
      sum + (subject.credits * subject.gradePoints), 0);
    
    const totalCredits = subjects.reduce((sum, subject) => 
      sum + subject.credits, 0);
    
    return (totalCreditPoints / totalCredits).toFixed(2);
  };

  const calculateCGPA = () => {
    // CGPA is average of SGPAs
    const semestersWithSubjects = semesters.filter(sem => sem.subjects.length > 0);
    
    if (semestersWithSubjects.length === 0) return 'N/A';
    
    const sgpaSum = semestersWithSubjects.reduce((sum, semester) => {
      const sgpa = parseFloat(calculateSGPA(semester.subjects));
      return sum + (isNaN(sgpa) ? 0 : sgpa);
    }, 0);
    
    return (sgpaSum / semestersWithSubjects.length).toFixed(2);
  };

  if (isLoading) {
    return (
      <div>
        <Navbar isAuthenticated={true} onLogout={onLogout} />
        <div className="grade-garage-loading">
          <div className="loading-spinner"></div>
          <p>Loading your academic records...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar isAuthenticated={true} onLogout={onLogout} />
      <div className="grade-garage-container">
        <div className="grade-garage-header">
          <h1>GradeGarage</h1>
          <p>Store and track your academic performance across semesters</p>
          
          <div className="cgpa-banner">
            <div className="cgpa-value">
              <h2>CGPA</h2>
              <div className="cgpa-number">{calculateCGPA()}</div>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="grade-garage-actions">
            {semesters.length < 8 && (
              <button onClick={addSemester} className="add-semester-button">
                <FaPlus /> Add Semester {semesters.length + 1}
              </button>
            )}
          </div>
        </div>
        
        <div className="semesters-grid">
          {semesters.map(semester => (
            <div key={semester.id} className="semester-card">
              <div className="semester-header">
                <h2>{semester.name}</h2>
                <button
                  onClick={() => deleteSemester(semester.id)}
                  className="delete-semester-button"
                  title="Delete Semester"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="subjects-container">
                {semester.subjects.map(subject => (
                  <div key={subject.id} className="subject-item">
                    {subject.isEditing ? (
                      <div className="subject-edit-form">
                        <select
                          value={subject.name}
                          onChange={(e) => handleEditSubjectChange(semester.id, subject.id, 'name', e.target.value)}
                        >
                          <option value="">Select Subject</option>
                          {cseSubjects[semester.name] && cseSubjects[semester.name].map((subj, idx) => (
                            <option key={idx} value={subj}>{subj}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                        {subject.name === "Other" && (
                          <input
                            type="text"
                            placeholder="Enter subject name"
                            value={subject.customName || ""}
                            onChange={(e) => handleEditSubjectChange(semester.id, subject.id, 'customName', e.target.value)}
                          />
                        )}
                        <div className="marks-credits-group">
                          <div className="input-group">
                            <label>Marks</label>
                            <input
                              type="number"
                              value={subject.marks}
                              onChange={(e) => handleEditSubjectChange(semester.id, subject.id, 'marks', e.target.value)}
                              placeholder="Marks"
                              min="0"
                              max="100"
                            />
                          </div>
                          <div className="input-group">
                            <label>Credits</label>
                            <input
                              type="number"
                              value={subject.credits}
                              onChange={(e) => handleEditSubjectChange(semester.id, subject.id, 'credits', e.target.value)}
                              placeholder="Credits"
                              min="0.5"
                              step="0.5"
                            />
                          </div>
                        </div>
                        <div className="edit-actions">
                          <button onClick={() => updateSubject(semester.id, subject.id)} className="action-button save">
                            <FaSave />
                          </button>
                          <button onClick={() => toggleEditSubject(semester.id, subject.id)} className="action-button cancel">
                            <FaUndo />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="subject-display">
                        <div className="subject-name">{subject.name}</div>
                        <div className="subject-details">
                          <div className="subject-marks">
                            <span className="detail-label">Marks:</span>
                            <span className="detail-value">{subject.marks}</span>
                          </div>
                          <div className="subject-credits">
                            <span className="detail-label">Credits:</span>
                            <span className="detail-value">{subject.credits}</span>
                          </div>
                          <div className={`subject-grade grade-${subject.grade}`}>
                            <span className="detail-label">Grade:</span>
                            <span className="detail-value">{subject.grade}</span>
                          </div>
                        </div>
                        <div className="subject-actions">
                          <button onClick={() => toggleEditSubject(semester.id, subject.id)} className="action-button edit">
                            <FaEdit />
                          </button>
                          <button onClick={() => deleteSubject(semester.id, subject.id)} className="action-button delete">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {semester.isAddingSubject ? (
                  <div className="add-subject-form">
                    <select
                      value={semester.newSubject.name}
                      onChange={(e) => handleNewSubjectChange(semester.id, 'name', e.target.value)}
                    >
                      <option value="">Select Subject</option>
                      {cseSubjects[semester.name] && cseSubjects[semester.name].map((subject, idx) => (
                        <option key={idx} value={subject}>{subject}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    {semester.newSubject.name === "Other" && (
                      <input
                        type="text"
                        placeholder="Enter subject name"
                        value={semester.newSubject.customName || ""}
                        onChange={(e) => handleNewSubjectChange(semester.id, 'customName', e.target.value)}
                      />
                    )}
                    <div className="marks-credits-group">
                      <div className="input-group">
                        <label>Marks</label>
                        <input
                          type="number"
                          placeholder="Marks"
                          value={semester.newSubject.marks}
                          onChange={(e) => handleNewSubjectChange(semester.id, 'marks', e.target.value)}
                          min="0"
                          max="100"
                        />
                      </div>
                      <div className="input-group">
                        <label>Credits</label>
                        <input
                          type="number"
                          placeholder="Credits"
                          value={semester.newSubject.credits}
                          onChange={(e) => handleNewSubjectChange(semester.id, 'credits', e.target.value)}
                          min="0.5"
                          step="0.5"
                        />
                      </div>
                    </div>
                    <div className="add-subject-actions">
                      <button onClick={() => addSubject(semester.id)} className="action-button save">
                        <FaSave /> Save
                      </button>
                      <button onClick={() => toggleAddSubject(semester.id)} className="action-button cancel">
                        <FaUndo /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => toggleAddSubject(semester.id)} className="add-subject-button">
                    <FaPlus /> Add Subject
                  </button>
                )}
              </div>
              
              <div className="semester-footer">
                <div className="sgpa-display">
                  <span>SGPA:</span>
                  <strong>{calculateSGPA(semester.subjects)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {semesters.length === 0 && (
          <div className="empty-state">
            <h2>No semesters found</h2>
            <p>Start tracking your academic journey by adding your first semester.</p>
            <button onClick={addSemester} className="add-semester-button">
              <FaPlus /> Add Semester 1
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeGarage;