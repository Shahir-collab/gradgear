import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlay, FaPlus, FaYoutube } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import './LecturesPage.css';

const LecturesPage = ({ isAuthenticated, onLogout }) => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [lectures, setLectures] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  
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

  // Sample lectures data (in a real app, this would come from an API)
  const sampleLectures = [
    // Data Structures and Algorithms
    { 
      id: 1, 
      title: 'Introduction to Data Structures', 
      subject: 'Data Structures and Algorithms', 
      module: 'Module I',
      instructor: 'Dr. Sharma',
      duration: '45:21',
      views: 5782,
      youtubeId: 'bum_19loj9A',
      semester: 'Semester IV' 
    },
    { 
      id: 2, 
      title: 'Arrays and Linked Lists', 
      subject: 'Data Structures and Algorithms', 
      module: 'Module I',
      instructor: 'Dr. Sharma',
      duration: '52:14',
      views: 4928,
      youtubeId: 'YQs6IC-vgmo',
      semester: 'Semester IV' 
    },
    { 
      id: 3, 
      title: 'Stacks and Queues', 
      subject: 'Data Structures and Algorithms', 
      module: 'Module II',
      instructor: 'Dr. Arjun V',
      duration: '48:37',
      views: 4215,
      youtubeId: 'XuCbpw6Bj1U',
      semester: 'Semester IV' 
    },
    { 
      id: 4, 
      title: 'Trees and Binary Search Trees', 
      subject: 'Data Structures and Algorithms', 
      module: 'Module III',
      instructor: 'Prof Aravindan',
      duration: '55:42',
      views: 3854,
      youtubeId: 'oSWTXtMglKE',
      semester: 'Semester IV' 
    },
    { 
      id: 5, 
      title: 'Graphs and Graph Algorithms', 
      subject: 'Data Structures and Algorithms', 
      module: 'Module IV',
      instructor: 'Dr. Sharma',
      duration: '59:18',
      views: 3621,
      youtubeId: 'tWVWeAqZ0WU',
      semester: 'Semester IV' 
    },
    
    // Operating System
    { 
      id: 6, 
      title: 'Introduction to Operating Systems', 
      subject: 'Operating System', 
      module: 'Module I',
      instructor: 'Prof. Verma',
      duration: '41:35',
      views: 6214,
      youtubeId: 'vBURTt97EkA',
      semester: 'Semester VI' 
    },
    { 
      id: 7, 
      title: 'Process Management', 
      subject: 'Operating System', 
      module: 'Module I',
      instructor: 'Prof. Verma',
      duration: '47:29',
      views: 5482,
      youtubeId: 'OrM7nZcxXZU',
      semester: 'Semester VI' 
    },
    { 
      id: 8, 
      title: 'Memory Management', 
      subject: 'Operating System', 
      module: 'Module II',
      instructor: 'Prof. Verma',
      duration: '50:12',
      views: 4923,
      youtubeId: 'qdkxXygc3rE',
      semester: 'Semester VI' 
    },
    { 
      id: 9, 
      title: 'File Systems', 
      subject: 'Operating System', 
      module: 'Module III',
      instructor: 'Prof. Verma',
      duration: '43:56',
      views: 4571,
      youtubeId: 'KN8YgJnShPM',
      semester: 'Semester VI' 
    },
    { 
      id: 10, 
      title: 'I/O Systems and Security', 
      subject: 'Operating System', 
      module: 'Module IV',
      instructor: 'Prof. Verma',
      duration: '49:08',
      views: 4218,
      youtubeId: 'YwqexcfbucE',
      semester: 'Semester VI' 
    },
    
    // Computer Networks
    { 
      id: 11, 
      title: 'Introduction to Computer Networks', 
      subject: 'Computer Networks', 
      module: 'Module I',
      instructor: 'Dr. Patel',
      duration: '44:23',
      views: 5863,
      youtubeId: '3QhU9jd03a0',
      semester: 'Semester VI' 
    },
    { 
      id: 12, 
      title: 'Physical and Data Link Layers', 
      subject: 'Computer Networks', 
      module: 'Module I',
      instructor: 'Dr. Patel',
      duration: '51:47',
      views: 5241,
      youtubeId: 'NrUCR3yQK7s',
      semester: 'Semester VI' 
    },
    { 
      id: 13, 
      title: 'Network Layer and Routing', 
      subject: 'Computer Networks', 
      module: 'Module II',
      instructor: 'Dr. Patel',
      duration: '56:32',
      views: 4872,
      youtubeId: 'QKfk7YFILws',
      semester: 'Semester VI' 
    },
    { 
      id: 14, 
      title: 'Transport Layer Protocols', 
      subject: 'Computer Networks', 
      module: 'Module III',
      instructor: 'Dr. Patel',
      duration: '48:19',
      views: 4436,
      youtubeId: 'uw9SRGq3V_0',
      semester: 'Semester VI' 
    },
    { 
      id: 15, 
      title: 'Application Layer and Network Security', 
      subject: 'Computer Networks', 
      module: 'Module IV',
      instructor: 'Dr. Patel',
      duration: '53:41',
      views: 4105,
      youtubeId: 'l25jCK37yIk',
      semester: 'Semester VI' 
    },
  ];

  useEffect(() => {
    // Filter lectures based on selections
    let filteredLectures = [...sampleLectures];
    
    if (selectedSemester) {
      filteredLectures = filteredLectures.filter(lecture => lecture.semester === selectedSemester);
    }
    
    if (selectedSubject) {
      filteredLectures = filteredLectures.filter(lecture => lecture.subject === selectedSubject);
    }
    
    if (searchQuery) {
      filteredLectures = filteredLectures.filter(lecture => 
        lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.module.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setLectures(filteredLectures);
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

  // Group lectures by subject and then by module
  const groupedLectures = lectures.reduce((groups, lecture) => {
    if (!groups[lecture.subject]) {
      groups[lecture.subject] = {};
    }
    
    if (!groups[lecture.subject][lecture.module]) {
      groups[lecture.subject][lecture.module] = [];
    }
    
    groups[lecture.subject][lecture.module].push(lecture);
    return groups;
  }, {});

  // Format duration from seconds to MM:SS
  const formatDuration = (duration) => {
    return duration;
  };

  // Handle play video
  const handlePlayVideo = (lecture) => {
    setActiveVideo(lecture);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close video player
  const handleCloseVideo = () => {
    setActiveVideo(null);
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      
      <div className="lectures-page">
        <h1 className="page-title">Video Lectures</h1>
        <p className="page-subtitle">Access video lectures for all subjects in your curriculum</p>
        
        {activeVideo && (
          <div className="video-player-container">
            <div className="video-player-wrapper">
              <div className="video-header">
                <div>
                  <h2>{activeVideo.title}</h2>
                  <p>{activeVideo.subject} | {activeVideo.module} | {activeVideo.instructor}</p>
                </div>
                <button className="close-video-btn" onClick={handleCloseVideo}>×</button>
              </div>
              <div className="video-responsive">
                <iframe
                  width="853"
                  height="480"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={activeVideo.title}
                ></iframe>
              </div>
            </div>
          </div>
        )}
        
        <div className="lectures-container">
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
              <h3>Learning Tips</h3>
              <ul>
                <li>Watch lectures in sequence</li>
                <li>Take notes while watching</li>
                <li>Review concepts regularly</li>
                <li>Combine with readings</li>
                <li>Discuss with peers</li>
              </ul>
            </div>
          </div>
          
          <div className="lectures-content">
            <div className="lectures-header">
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Search lectures" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
              
              <div className="header-actions">
                <select>
                  <option value="">Semester {selectedSemester ? selectedSemester.split(' ')[1] : ''}</option>
                </select>
                <button className="add-lecture-btn">
                  <FaPlus /> Add Lecture
                </button>
              </div>
            </div>
            
            <div className="lectures-list">
              {Object.keys(groupedLectures).length > 0 ? (
                Object.entries(groupedLectures).map(([subject, modules]) => (
                  <div key={subject} className="subject-section">
                    <h2 className="subject-title">{subject}</h2>
                    
                    {Object.entries(modules).map(([module, moduleLectures]) => (
                      <div key={module} className="module-section">
                        <h3 className="module-title">{module}</h3>
                        <div className="lectures-grid">
                          {moduleLectures.map(lecture => (
                            <div key={lecture.id} className="lecture-card" onClick={() => handlePlayVideo(lecture)}>
                              <div className="thumbnail-container">
                                <img 
                                  src={`https://img.youtube.com/vi/${lecture.youtubeId}/mqdefault.jpg`} 
                                  alt={lecture.title} 
                                  className="lecture-thumbnail"
                                />
                                <div className="duration-badge">{formatDuration(lecture.duration)}</div>
                                <div className="play-overlay">
                                  <FaPlay className="play-icon" />
                                </div>
                              </div>
                              <div className="lecture-info">
                                <h4 className="lecture-title">{lecture.title}</h4>
                                <p className="lecture-instructor">{lecture.instructor}</p>
                                <div className="lecture-stats">
                                  <span className="views-count">{lecture.views.toLocaleString()} views</span>
                                  <span className="youtube-badge">
                                    <FaYoutube className="youtube-icon" /> YouTube
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="no-lectures">
                  <p>Select a semester and subject to view available lectures</p>
                  {selectedSemester && selectedSubject && (
                    <p>No lectures available for the selected filters</p>
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

export default LecturesPage;