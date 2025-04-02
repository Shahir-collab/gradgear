
import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import './NotesPage.css';

const NotesPage = ({ isAuthenticated, onLogout }) => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);
  
  // CUSAT CSE curriculum data structure
  const curriculum = {
    'Semester I': [
      { code: '19-200-0101B', name: 'Calculus' },
      { code: '19-200-0102B', name: 'Engineering Physics' },
      { code: '19-200-0103B', name: 'Engineering Mechanics' },
      { code: '19-200-0104B', name: 'Basic Civil Engineering' },
      { code: '19-200-0105B', name: 'Basic Mechanical Engineering' },
      { code: '19-200-0106B', name: 'Soft Skills Development' },
      { code: '19-200-0107B', name: 'Civil Engineering Workshop' },
      { code: '19-200-0108B', name: 'Mechanical Engineering Workshop' },
      { code: '19-200-0109B', name: 'Language Lab' },
    ],
    'Semester II': [
      { code: '19-200-0201B', name: 'Computer Programming' },
      { code: '19-200-0202B', name: 'Engineering Chemistry' },
      { code: '19-200-0203B', name: 'Engineering Graphics' },
      { code: '19-200-0204B', name: 'Basic Electrical Engineering' },
      { code: '19-200-0205B', name: 'Basic Electronics Engineering' },
      { code: '19-200-0206B', name: 'Environmental Studies' },
      { code: '19-200-0207B', name: 'Electrical Engineering Workshop' },
      { code: '19-200-0208B', name: 'Computer Programming Laboratory' },
    ],
    'Semester III': [
      { code: '19-200-0301', name: 'Linear Algebra and Transform Techniques' },
      { code: '19-202-0302', name: 'Logic Design' },
      { code: '19-202-0303', name: 'Discrete Computational Structures' },
      { code: '19-202-0304', name: 'Object Oriented Programming' },
      { code: '19-202-0305', name: 'Principles of Programming Languages' },
      { code: '19-202-0306', name: 'Data and Computer Communication' },
      { code: '19-202-0307', name: 'Digital Electronics Laboratory' },
      { code: '19-202-0308', name: 'Object Oriented Programming Laboratory' },
    ],
    'Semester IV': [
      { code: '19-200-0401', name: 'Complex Variables and Partial Differential Equations' },
      { code: '19-202-0402', name: 'Microprocessors' },
      { code: '19-202-0403', name: 'Computer Architecture and Organization' },
      { code: '19-202-0404', name: 'Automata Languages and Computations' },
      { code: '19-202-0405', name: 'Data Structures and Algorithms' },
      { code: '19-202-0406', name: 'Database Management Systems' },
      { code: '19-200-0407', name: 'Universal Human Values' },
      { code: '19-202-0408', name: 'Database Management Systems Laboratory' },
      { code: '19-202-0409', name: 'Data Structures Laboratory' },
    ],
    'Semester V': [
      { code: '19-200-0501', name: 'Numerical and Statistical Methods' },
      { code: '19-202-0502', name: 'System Programming' },
      { code: '19-202-0503', name: 'Object Oriented Software Engineering' },
      { code: '19-202-0504', name: 'Computer Graphics' },
      { code: '19-202-0505', name: 'Advanced Microprocessors and Microcontrollers' },
      { code: '19-202-0506', name: 'Web Technologies (Elective)' },
      { code: '19-202-0507', name: 'Machine Learning (Elective)' },
      { code: '19-202-0508', name: 'Embedded System Design (Elective)' },
      { code: '19-202-0509', name: 'Bioinformatics (Elective)' },
      { code: '19-202-0510', name: 'Computer Graphics Laboratory' },
      { code: '19-202-0511', name: 'Microprocessors Laboratory' },
    ],
    'Semester VI': [
      { code: '19-202-0601', name: 'Computer Networks' },
      { code: '19-202-0602', name: 'Compiler Construction' },
      { code: '19-202-0603', name: 'Analysis and Design of Algorithms' },
      { code: '19-202-0604', name: 'Data Mining' },
      { code: '19-202-0605', name: 'Operating System' },
      { code: '19-202-0606', name: 'Neural Networks and Deep Learning (Elective)' },
      { code: '19-202-0607', name: 'Software Project Management (Elective)' },
      { code: '19-202-0608', name: 'Digital Image Processing (Elective)' },
      { code: '19-202-0609', name: 'Ethical Hacking (Elective)' },
      { code: '19-202-0610', name: 'Operating System Laboratory' },
      { code: '19-202-0611', name: 'Mini Project' },
    ],
    'Semester VII': [
      { code: '19-202-0701', name: 'Principles of Management' },
      { code: '19-202-0702', name: 'Advanced Architecture and Parallel Processing' },
      { code: '19-202-0703', name: 'Cryptography and Network Security' },
      { code: '19-202-0704', name: 'Mobile Computing Technology (Elective)' },
      { code: '19-202-0705', name: 'Internet of Things and Applications (Elective)' },
      { code: '19-202-0706', name: 'Biometric Technologies (Elective)' },
      { code: '19-202-0707', name: 'Computer Vision (Elective)' },
      { code: '19-202-0708', name: 'Mobile Application Development (Open Elective)' },
      { code: '19-202-0709', name: 'System Modeling and Simulation (Open Elective)' },
      { code: '19-202-0710', name: 'Cyber Law and Ethics (Open Elective)' },
      { code: '19-202-0711', name: 'Business Intelligence and Analytics (Open Elective)' },
      { code: '19-202-0712', name: 'Language Processors Laboratory' },
      { code: '19-202-0713', name: 'Networks Laboratory' },
      { code: '19-202-0714', name: 'Entrepreneurship Development' },
      { code: '19-202-0715', name: 'Project Phase I' },
      { code: '19-202-0716', name: 'Industrial Internship' },
    ],
    'Semester VIII': [
      { code: '19-202-0801', name: 'Artificial Intelligence' },
      { code: '19-202-0802', name: 'Big Data Analytics (Elective)' },
      { code: '19-202-0803', name: 'Augmented Reality (Elective)' },
      { code: '19-202-0804', name: 'Computational Linguistics (Elective)' },
      { code: '19-202-0805', name: 'Recommender Systems (Elective)' },
      { code: '19-202-0806', name: 'Cloud Computing (Elective)' },
      { code: '19-202-0807', name: 'Agent Based Intelligent System (Elective)' },
      { code: '19-202-0808', name: 'Blockchain (Elective)' },
      { code: '19-202-0809', name: 'Advanced Compiler Design and Optimization (Elective)' },
      { code: '19-202-0810', name: 'High Performance Embedded Computing (Open Elective)' },
      { code: '19-202-0811', name: 'Cyberspace and Information System Security (Open Elective)' },
      { code: '19-202-0812', name: 'Soft Computing (Open Elective)' },
      { code: '19-202-0813', name: 'Internet of Things (Open Elective)' },
      { code: '19-200-0814', name: 'Constitutional Law (Open Elective)' },
      { code: '19-202-0815', name: 'Seminar' },
      { code: '19-202-0816', name: 'Project Phase II' },
      { code: '19-202-0817', name: 'Comprehensive Viva Voce' },
    ],
  };

  // Sample notes data (in a real app, this would come from an API)
  const sampleNotes = [
    { id: 1, title: 'Module I', subject: 'Data Structures and Algorithms', author: 'Naveen ', downloads: 478, semester: 'Semester IV' },
    { id: 2, title: 'Module II', subject: 'Data Structures and Algorithms', author: 'Ashalakshmi', downloads: 271, semester: 'Semester IV' },
    { id: 3, title: 'Module III', subject: 'Data Structures and Algorithms', author: 'Anamga', downloads: 259, semester: 'Semester IV' },
    { id: 4, title: 'Module IV', subject: 'Data Structures and Algorithms', author: 'Sreeram', downloads: 286, semester: 'Semester IV' },
    { id: 5, title: 'Module I', subject: 'Computer Networks', author: 'Aravind ', downloads: 345, semester: 'Semester VI' },
    { id: 6, title: 'Module II', subject: 'Computer Networks', author: 'Aravind', downloads: 289, semester: 'Semester VI' },
    { id: 7, title: 'Module III', subject: 'Computer Networks', author: 'Aravind', downloads: 116, semester: 'Semester VI' },
    { id: 8, title: 'Module IV', subject: 'Computer Networks', author: 'Aravind', downloads: 79 ,getSubjectsForSemester : 'Semester VI' },
  ];

  useEffect(() => {
    // Filter notes based on selections
    let filteredNotes = [...sampleNotes];
    
    if (selectedSemester) {
      filteredNotes = filteredNotes.filter(note => note.semester === selectedSemester);
    }
    
    if (selectedSubject) {
      filteredNotes = filteredNotes.filter(note => note.subject === selectedSubject);
    }
    
    if (searchQuery) {
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setNotes(filteredNotes);
  }, [selectedSemester, selectedSubject, searchQuery]);

  // Get unique subjects from the selected semester
  const getSubjectsForSemester = () => {
    if (!selectedSemester) return [];
    return curriculum[selectedSemester] || [];
  };

  // Handle semester change
  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
    setSelectedSubject(''); // Reset subject when semester changes
  };

  // Handle subject change
  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  return (
    <div>
      {/* Use the existing Navbar component */}
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />

      {/* Notes Page Content */}
      <div className="notes-page">
        <h1 className="page-title">CSE Study Notes</h1>
        <p className="page-subtitle">Access comprehensive study materials for your courses</p>
        
        <div className="notes-container">
          <div className="filters-section">
            <h2>Filters</h2>
            <button className="reset-button">Reset</button>
            
            <div className="filter-group">
              <label>Semester</label>
              <select value={selectedSemester} onChange={handleSemesterChange}>
                <option value="">Select Semester</option>
                {Object.keys(curriculum).map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Subject</label>
              <select 
                value={selectedSubject} 
                onChange={handleSubjectChange}
                disabled={!selectedSemester}
              >
                <option value="">Select Subject</option>
                {getSubjectsForSemester().map(subject => (
                  <option key={subject.code} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="notes-content">
            <div className="notes-header">
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Search notes" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
              
              <div className="header-actions">
                <select>
                  <option value="">Semester {selectedSemester ? selectedSemester.split(' ')[1] : ''}</option>
                </select>
                <button className="add-notes-btn">
                  <FaPlus /> Add Notes
                </button>
              </div>
            </div>
            
            <div className="notes-grid">
              {notes.length > 0 ? (
                notes.map(note => (
                  <div key={note.id} className="note-card">
                    <div className="note-info">
                      <h3>{note.author}</h3>
                      <p className="notes-content-label">Notes Content</p>
                      <div className="note-module">
                        <span className="bullet">•</span> {note.title}
                      </div>
                    </div>
                    <div className="note-actions">
                      <div className="downloads-count">
                        <span className="download-icon">↓</span> {note.downloads}
                      </div>
                      <button className="download-btn">Download</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-notes">
                  <p>Select a semester and subject to view available notes</p>
                  {selectedSemester && selectedSubject && (
                    <p>No notes available for the selected filters</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;