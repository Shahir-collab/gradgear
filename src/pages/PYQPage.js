import React, { useState, useEffect } from 'react';
import { FaSearch, FaDownload, FaPlus } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import './PYQPage.css';

const PYQPage = ({ isAuthenticated, onLogout }) => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [questionPapers, setQuestionPapers] = useState([]);
  
  // CUSAT CSE curriculum data structure
  const curriculum = {
    'Semester I': [
      { code: '19-200-0101B', name: 'Calculus' },
      { code: '19-200-0102B', name: 'Engineering Physics' },
      { code: '19-200-0103B', name: 'Engineering Mechanics' },
      { code: '19-200-0104B', name: 'Basic Civil Engineering' },
      { code: '19-200-0105B', name: 'Basic Mechanical Engineering' },
      { code: '19-200-0106B', name: 'Soft Skills Development' },
    ],
    'Semester II': [
      { code: '19-200-0201B', name: 'Computer Programming' },
      { code: '19-200-0202B', name: 'Engineering Chemistry' },
      { code: '19-200-0203B', name: 'Engineering Graphics' },
      { code: '19-200-0204B', name: 'Basic Electrical Engineering' },
      { code: '19-200-0205B', name: 'Basic Electronics Engineering' },
      { code: '19-200-0206B', name: 'Environmental Studies' },
    ],
    'Semester III': [
      { code: '19-200-0301', name: 'Linear Algebra and Transform Techniques' },
      { code: '19-202-0302', name: 'Logic Design' },
      { code: '19-202-0303', name: 'Discrete Computational Structures' },
      { code: '19-202-0304', name: 'Object Oriented Programming' },
      { code: '19-202-0305', name: 'Principles of Programming Languages' },
      { code: '19-202-0306', name: 'Data and Computer Communication' },
    ],
    'Semester IV': [
      { code: '19-200-0401', name: 'Complex Variables and Partial Differential Equations' },
      { code: '19-202-0402', name: 'Microprocessors' },
      { code: '19-202-0403', name: 'Computer Architecture and Organization' },
      { code: '19-202-0404', name: 'Automata Languages and Computations' },
      { code: '19-202-0405', name: 'Data Structures and Algorithms' },
      { code: '19-202-0406', name: 'Database Management Systems' },
      { code: '19-200-0407', name: 'Universal Human Values' },
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
    ],
    'Semester VII': [
      { code: '19-202-0701', name: 'Principles of Management' },
      { code: '19-202-0702', name: 'Advanced Architecture and Parallel Processing' },
      { code: '19-202-0703', name: 'Cryptography and Network Security' },
      { code: '19-202-0704', name: 'Mobile Computing Technology (Elective)' },
      { code: '19-202-0705', name: 'Internet of Things and Applications (Elective)' },
      { code: '19-202-0706', name: 'Biometric Technologies (Elective)' },
      { code: '19-202-0707', name: 'Computer Vision (Elective)' },
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
    ],
  };

  // Sample question papers data (in a real app, this would come from an API)
  const sampleQuestionPapers = [
    { id: 1, title: 'End Semester Exam 2022', subject: 'Data Structures and Algorithms', year: 2022, type: 'End Semester', downloads: 478, semester: 'Semester IV' },
    { id: 2, title: 'End Semester Exam 2021', subject: 'Data Structures and Algorithms', year: 2021, type: 'End Semester', downloads: 271, semester: 'Semester IV' },
    { id: 3, title: 'Internal Exam 1 2022', subject: 'Data Structures and Algorithms', year: 2022, type: 'Internal', downloads: 259, semester: 'Semester IV' },
    { id: 4, title: 'Internal Exam 2 2022', subject: 'Data Structures and Algorithms', year: 2022, type: 'Internal', downloads: 286, semester: 'Semester IV' },
    { id: 5, title: 'End Semester Exam 2022', subject: 'Computer Networks', year: 2022, type: 'End Semester', downloads: 345, semester: 'Semester VI' },
    { id: 6, title: 'End Semester Exam 2021', subject: 'Computer Networks', year: 2021, type: 'End Semester', downloads: 289, semester: 'Semester VI' },
    { id: 7, title: 'Internal Exam 1 2022', subject: 'Computer Networks', year: 2022, type: 'Internal', downloads: 116, semester: 'Semester VI' },
    { id: 8, title: 'Internal Exam 2 2022', subject: 'Computer Networks', year: 2022, type: 'Internal', downloads: 79, semester: 'Semester VI' },
    { id: 9, title: 'End Semester Exam 2022', subject: 'Operating System', year: 2022, type: 'End Semester', downloads: 412, semester: 'Semester VI' },
    { id: 10, title: 'End Semester Exam 2021', subject: 'Operating System', year: 2021, type: 'End Semester', downloads: 356, semester: 'Semester VI' },
    { id: 11, title: 'End Semester Exam 2020', subject: 'Operating System', year: 2020, type: 'End Semester', downloads: 245, semester: 'Semester VI' },
    { id: 12, title: 'Internal Exam 1 2022', subject: 'Operating System', year: 2022, type: 'Internal', downloads: 178, semester: 'Semester VI' },
  ];

  useEffect(() => {
    // Filter question papers based on selections
    let filteredPapers = [...sampleQuestionPapers];
    
    if (selectedSemester) {
      filteredPapers = filteredPapers.filter(paper => paper.semester === selectedSemester);
    }
    
    if (selectedSubject) {
      filteredPapers = filteredPapers.filter(paper => paper.subject === selectedSubject);
    }
    
    if (searchQuery) {
      filteredPapers = filteredPapers.filter(paper => 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.year.toString().includes(searchQuery) ||
        paper.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setQuestionPapers(filteredPapers);
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

  // Group question papers by subject
  const groupedPapers = questionPapers.reduce((groups, paper) => {
    if (!groups[paper.subject]) {
      groups[paper.subject] = [];
    }
    groups[paper.subject].push(paper);
    return groups;
  }, {});

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      
      <div className="pyq-page">
        <h1 className="page-title">Previous Year Question Papers</h1>
        <p className="page-subtitle">Access question papers from previous years to prepare for your exams</p>
        
        <div className="pyq-container">
          <div className="filters-section">
            <h2>Filters</h2>
            <button className="reset-button" onClick={() => {
              setSelectedSemester('');
              setSelectedSubject('');
              setSearchQuery('');
            }}>Reset</button>
            
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
            
            <div className="filter-info">
              <h3>Why use previous year papers?</h3>
              <ul>
                <li>Understand exam pattern</li>
                <li>Practice with actual questions</li>
                <li>Identify important topics</li>
                <li>Improve time management</li>
                <li>Boost confidence for exams</li>
              </ul>
            </div>
          </div>
          
          <div className="pyq-content">
            <div className="pyq-header">
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Search question papers" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
              
              <div className="header-actions">
                <select>
                  <option value="">Semester {selectedSemester ? selectedSemester.split(' ')[1] : ''}</option>
                </select>
                <button className="add-pyq-btn">
                  <FaPlus /> Add Question Paper
                </button>
              </div>
            </div>
            
            <div className="pyq-papers">
              {Object.keys(groupedPapers).length > 0 ? (
                Object.entries(groupedPapers).map(([subject, papers]) => (
                  <div key={subject} className="subject-section">
                    <h2 className="subject-title">{subject}</h2>
                    <div className="papers-grid">
                      {papers.map(paper => (
                        <div key={paper.id} className="paper-card">
                          <div className="paper-info">
                            <div className="paper-year">{paper.year}</div>
                            <h3 className="paper-title">{paper.title}</h3>
                            <div className="paper-type">{paper.type}</div>
                          </div>
                          <div className="paper-actions">
                            <div className="downloads-count">
                              <span className="download-icon">↓</span> {paper.downloads}
                            </div>
                            <button className="download-btn">Download</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-papers">
                  <p>Select a semester and subject to view available question papers</p>
                  {selectedSemester && selectedSubject && (
                    <p>No question papers available for the selected filters</p>
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

export default PYQPage;