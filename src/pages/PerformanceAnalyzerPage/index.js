// File: src/pages/PerformanceAnalyzerPage/index.js

// 1. React and core libraries
import React, { useState, useEffect } from 'react';

// 2. Component imports
import Navbar from '../../components/Navbar';
import SkillRadarChart from '../../components/PerformanceAnalyzer/SkillRadarChart';
import StrengthWeaknessPanel from '../../components/PerformanceAnalyzer/StrengthWeaknessPanel';
import RecommendationPanel from '../../components/PerformanceAnalyzer/RecommendationPanel';
import ElectiveRecommender from '../../components/PerformanceAnalyzer/ElectiveRecommender';
import CareerPathExplorer from '../../components/PerformanceAnalyzer/CareerPathExplorer';
import SubjectPerformanceChart from '../../components/PerformanceAnalyzer/SubjectPerformanceChart';
import GPAPredictionChart from '../../components/PerformanceAnalyzer/GPAPredictionChart';

// 3. Configuration and service imports
import { subjectSkillMapping, skillCategories, careerPathMapping } from '../../config/skillMappingConfig';
import { predictRemainingGPA } from '../../services/predictionService';

// 4. Style imports
import './PerformanceAnalyzerPage.css';

const PerformanceAnalyzerPage = ({ onLogout }) => {
  // Original state variables
  const [studentData, setStudentData] = useState(null);
  const [skillScores, setSkillScores] = useState({});
  const [strengthAreas, setStrengthAreas] = useState([]);
  const [weaknessAreas, setWeaknessAreas] = useState([]);
  const [recommendedElectives, setRecommendedElectives] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Enhanced state variables for triple-mode functionality
  const [analysisMode, setAnalysisMode] = useState('skill'); // 'skill', 'subject', or 'prediction'
  const [subjectData, setSubjectData] = useState([]); // For subject analysis
  
  // New state variables for GPA prediction
  const [predictionData, setPredictionData] = useState(null);
  const [predictionError, setPredictionError] = useState(null);

  useEffect(() => {
    // Fetch student's academic data
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call
        // For now, we'll simulate with a timeout
        setTimeout(() => {
          // Simulated data
          const mockData = {
            studentId: "ST12345",
            name: "John Doe",
            courses: [
              { 
                courseCode: "19-202-0302", 
                courseName: "Logic Design",
                totalMarks: 85, 
                maxMarks: 100,
                semester: 3
              },
              { 
                courseCode: "19-202-0405", 
                courseName: "Data Structures and Algorithms",
                totalMarks: 78, 
                maxMarks: 100,
                semester: 4
              }
            ],
            completedCourses: ["19-202-0302", "19-202-0405"],
            semesterData: [
              { semester: 1, gpa: 8.2 },
              { semester: 2, gpa: 8.5 },
              { semester: 3, gpa: 8.7 },
              { semester: 4, gpa: 8.4 }
            ]
          };
          
          setStudentData(mockData);
          
          // Process data to calculate skill scores
          const scores = calculateSkillScores(mockData.courses);
          setSkillScores(scores);
          
          // Identify strengths and weaknesses
          const { strengths, weaknesses } = identifyStrengthsAndWeaknesses(scores);
          setStrengthAreas(strengths);
          setWeaknessAreas(weaknesses);
          
          // Generate recommendations
          const electives = recommendElectives(scores, mockData.completedCourses);
          setRecommendedElectives(electives);
          
          // Suggest career paths
          const careers = suggestCareerPaths(scores);
          setCareerPaths(careers);
          
          // Prepare subject data for subject analysis mode
          const subjects = prepareSubjectData(mockData.courses);
          setSubjectData(subjects);
          
          // Generate GPA prediction
          try {
            const prediction = predictRemainingGPA(mockData.semesterData);
            setPredictionData(prediction);
          } catch (error) {
            console.error("Prediction error:", error.message);
            setPredictionError(error.message);
          }
          
          setIsLoading(false);
        }, 1500);
        
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setIsLoading(false);
      }
    };
    
    fetchStudentData();
  }, []);

  // Calculate skill scores based on course performances
  const calculateSkillScores = (courses) => {
    // Existing implementation remains unchanged
    const skillScores = {};
    
    // Initialize all skills with zero score
    Object.values(skillCategories).flat().forEach(skill => {
      skillScores[skill] = 0;
    });
    
    let skillDataPoints = {};
    Object.values(skillCategories).flat().forEach(skill => {
      skillDataPoints[skill] = 0;
    });
    
    // Calculate weighted scores for each skill based on course performance
    courses.forEach(course => {
      const mapping = subjectSkillMapping[course.courseCode];
      if (!mapping) return;
      
      // Calculate normalized score (0-1)
      const normalizedScore = course.totalMarks / course.maxMarks;
      
      // Add weighted contribution to each skill
      Object.entries(mapping.weightage).forEach(([skill, weight]) => {
        skillScores[skill] += normalizedScore * weight * 10; // Scale to 0-10
        skillDataPoints[skill]++;
      });
    });
    
    // Average the scores by the number of data points
    Object.keys(skillScores).forEach(skill => {
      if (skillDataPoints[skill] > 0) {
        skillScores[skill] = skillScores[skill] / skillDataPoints[skill];
      }
    });
    
    return skillScores;
  };

  // Identify strengths and weaknesses
  const identifyStrengthsAndWeaknesses = (scores) => {
    // Existing implementation remains unchanged
    const sortedSkills = Object.entries(scores)
      .filter(([_, score]) => score > 0) // Only consider skills with data
      .sort((a, b) => b[1] - a[1]);
    
    // Top 3 skills are strengths
    const strengths = sortedSkills.slice(0, 3).map(([skill, score]) => ({
      skill,
      score,
      category: Object.entries(skillCategories).find(([_, skills]) => 
        skills.includes(skill)
      )?.[0] || 'other'
    }));
    
    // Bottom 3 skills with scores above 0 are weaknesses
    const weaknesses = sortedSkills.slice(-3).map(([skill, score]) => ({
      skill,
      score,
      category: Object.entries(skillCategories).find(([_, skills]) => 
        skills.includes(skill)
      )?.[0] || 'other'
    }));
    
    return { strengths, weaknesses };
  };

  // Recommend electives based on strengths and interests
  const recommendElectives = (scores, completedCourses) => {
    // Existing implementation remains unchanged
    return ["19-202-0507", "19-202-0606"];
  };

  // Suggest career paths based on skill profile
  const suggestCareerPaths = (scores) => {
    // Existing implementation remains unchanged
    return [
      {
        career: "Machine Learning Engineer",
        matchPercentage: 85,
        recommendedMasters: ["MS in Machine Learning", "MS in Artificial Intelligence"]
      }
    ];
  };
  
  // New function: Prepare subject data for subject analysis mode
  const prepareSubjectData = (courses) => {
    // Transform course data into subject data format
    return courses.map(course => {
      // Determine category based on course code pattern or other logic
      const category = course.courseCode.includes("19-202-05") ? "Elective" : "Core";
      
      // Calculate score as percentage
      const score = (course.totalMarks / course.maxMarks) * 100;
      
      return {
        code: course.courseCode,
        name: course.courseName,
        score: score,
        category: category,
        semester: course.semester
      };
    });
  };

  return (
    <div className="performance-analyzer-page">
      <Navbar isAuthenticated={true} onLogout={onLogout} />
      
      <div className="page-content">
        <h1 className="page-title">Performance Analyzer</h1>
        <p className="page-subtitle">Discover your academic strengths and opportunities for growth</p>
        
        {/* Mode Selection Toggle - Enhanced with Prediction Mode */}
        <div className="mode-selector">
          <div className="toggle-container">
            <button 
              className={`mode-toggle ${analysisMode === 'skill' ? 'active' : ''}`}
              onClick={() => setAnalysisMode('skill')}
            >
              Skill Analysis
            </button>
            <button 
              className={`mode-toggle ${analysisMode === 'subject' ? 'active' : ''}`}
              onClick={() => setAnalysisMode('subject')}
            >
              Subject Analysis
            </button>
            <button 
              className={`mode-toggle ${analysisMode === 'prediction' ? 'active' : ''}`}
              onClick={() => setAnalysisMode('prediction')}
            >
              GPA Prediction
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Analyzing your academic performance...</p>
          </div>
        ) : (
          <div className="analyzer-dashboard">
            {analysisMode === 'skill' && (
              // Skill Analysis Mode - Unchanged
              <>
                {/* Skill Radar Chart */}
                <div className="radar-chart-container">
                  <h2>Your Skill Profile</h2>
                  <SkillRadarChart skillScores={skillScores} categories={skillCategories} />
                </div>
                
                {/* Strengths and Weaknesses */}
                <div className="strength-weakness-container">
                  <StrengthWeaknessPanel 
                    strengths={strengthAreas} 
                    weaknesses={weaknessAreas} 
                  />
                </div>
                
                {/* Recommendations */}
                <div className="recommendations-container">
                  <h2>Personalized Recommendations</h2>
                  <RecommendationPanel 
                    strengths={strengthAreas}
                    weaknesses={weaknessAreas}
                  />
                </div>
                
                {/* Elective Recommendations */}
                <div className="electives-container">
                  <h2>Recommended Electives</h2>
                  <ElectiveRecommender 
                    recommendedElectives={recommendedElectives}
                    studentData={studentData}
                  />
                </div>
                
                {/* Career Path Explorer */}
                <div className="career-path-container">
                  <h2>Potential Career Paths</h2>
                  <CareerPathExplorer 
                    careerPaths={careerPaths}
                  />
                </div>
              </>
            )}
            
            {analysisMode === 'subject' && (
              // Subject Analysis Mode - Unchanged
              <>
                <div className="subject-analysis-container">
                  <h2>Subject Performance Analysis</h2>
                  <SubjectPerformanceChart subjectData={subjectData} />
                  
                  {/* Focus Areas Section */}
                  <div className="focus-areas-section">
                    <h2>Focus Areas</h2>
                    <div className="focus-areas-container">
                      {subjectData
                        .filter(subject => subject.score < 70)
                        .map((subject, index) => (
                          <div key={`focus-${index}`} className="focus-area-card">
                            <h3>{subject.name}</h3>
                            <p>Current Score: {subject.score.toFixed(1)}%</p>
                            <p>Estimated hours to master: {Math.round((100 - subject.score) * 0.5)}</p>
                            <div className="improvement-strategies">
                              <h4>Recommended Strategies:</h4>
                              <ul>
                                <li>Review lecture notes and past assignments</li>
                                <li>Form a study group with peers</li>
                                <li>Utilize office hours for personalized guidance</li>
                                <li>Practice with additional problem sets</li>
                              </ul>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {analysisMode === 'prediction' && (
              // New GPA Prediction Mode
              <>
                <div className="prediction-analysis-container">
                  <h2>GPA Prediction & Trajectory</h2>
                  
                  {predictionError ? (
                    <div className="prediction-error">
                      <p>
                        <strong>Unable to generate prediction:</strong> {predictionError}
                      </p>
                      <p>Please ensure you have completed at least two semesters to enable accurate predictions.</p>
                    </div>
                  ) : predictionData ? (
                    <>
                      <GPAPredictionChart 
                        semesterData={studentData?.semesterData || []}
                        predictedData={predictionData.predictedSemesters}
                        confidenceScore={predictionData.confidenceScore}
                      />
                      
                      <div className="prediction-details">
                        <h3>Prediction Details</h3>
                        <div className="prediction-details-grid">
                          <div className="prediction-detail-card">
                            <h4>Current CGPA</h4>
                            <p className="detail-value">
                              {(studentData?.semesterData?.reduce((sum, sem) => sum + sem.gpa, 0) / 
                                studentData?.semesterData?.length).toFixed(2)}
                            </p>
                            <p className="detail-description">Based on completed semesters</p>
                          </div>
                          
                          <div className="prediction-detail-card">
                            <h4>Predicted Final CGPA</h4>
                            <p className="detail-value">
                              {((studentData?.semesterData?.reduce((sum, sem) => sum + sem.gpa, 0) + 
                                predictionData.predictedSemesters.reduce((sum, sem) => sum + sem.gpa, 0)) / 
                                (studentData?.semesterData?.length + predictionData.predictedSemesters.length)).toFixed(2)}
                            </p>
                            <p className="detail-description">Expected at graduation</p>
                          </div>
                          
                          <div className="prediction-detail-card">
                            <h4>Predicted Trend</h4>
                            <p className="detail-value">
                              {predictionData.model.slope > 0 ? 
                                <span className="positive-trend">Upward</span> : 
                                predictionData.model.slope < 0 ? 
                                <span className="negative-trend">Downward</span> : 
                                <span className="neutral-trend">Stable</span>}
                            </p>
                            <p className="detail-description">Based on semester-to-semester changes</p>
                          </div>
                          
                          <div className="prediction-detail-card">
                            <h4>Model Confidence</h4>
                            <p className="detail-value">{predictionData.confidenceScore}%</p>
                            <p className="detail-description">Higher values indicate more reliable predictions</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="prediction-recommendations">
                        <h3>Strategic Recommendations</h3>
                        <div className="prediction-recommendation-cards">
                          <div className="recommendation-card">
                            <h4>Performance Strategy</h4>
                            <p>
                              {predictionData.model.slope > 0 ? 
                                "Maintain your current upward trajectory by continuing effective study habits." : 
                                predictionData.model.slope < 0 ? 
                                "Consider adjusting your study approach to reverse the downward trend in GPA." : 
                                "Your performance is consistent. Consider targeted improvements in specific subjects."}
                            </p>
                          </div>
                          
                          <div className="recommendation-card">
                            <h4>Resource Allocation</h4>
                            <p>
                              Based on your predicted performance, allocate approximately 
                              {predictionData.model.slope < 0 ? 
                                " 25-30% more study time" : 
                                " the same amount of study time"} for upcoming semesters 
                              to achieve optimal results.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="loading-prediction">
                      <div className="loading-spinner small"></div>
                      <p>Generating GPA prediction...</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAnalyzerPage;