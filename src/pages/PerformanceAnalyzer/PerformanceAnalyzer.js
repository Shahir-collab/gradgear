// File: /frontend/src/pages/PerformanceAnalyzer/PerformanceAnalyzer.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillRadarChart from '../../components/PerformanceAnalyzer/SkillRadarChart';
import StrengthWeaknessPanel from '../../components/PerformanceAnalyzer/StrengthWeaknessPanel';
import RecommendationPanel from '../../components/PerformanceAnalyzer/RecommendationPanel';
import ElectiveRecommender from '../../components/PerformanceAnalyzer/ElectiveRecommender';
import CareerPathExplorer from '../../components/PerformanceAnalyzer/CareerPathExplorer';
import SemesterProgressChart from '../../components/PerformanceAnalyzer/SemesterProgressChart';
import './PerformanceAnalyzer.css';

import { subjectSkillMapping, skillCategories, careerPathMapping } from '../../config/skillMappingConfig';

const PerformanceAnalyzer = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [skillScores, setSkillScores] = useState({});
  const [strengthAreas, setStrengthAreas] = useState([]);
  const [weaknessAreas, setWeaknessAreas] = useState([]);
  const [recommendedElectives, setRecommendedElectives] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch student's academic data
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/student/performance');
        const data = await response.json();
        setStudentData(data);
        
        // Process data to calculate skill scores
        const scores = calculateSkillScores(data.courses);
        setSkillScores(scores);
        
        // Identify strengths and weaknesses
        const { strengths, weaknesses } = identifyStrengthsAndWeaknesses(scores);
        setStrengthAreas(strengths);
        setWeaknessAreas(weaknesses);
        
        // Generate recommendations
        const electives = recommendElectives(scores, data.completedCourses);
        setRecommendedElectives(electives);
        
        // Suggest career paths
        const careers = suggestCareerPaths(scores);
        setCareerPaths(careers);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setIsLoading(false);
      }
    };
    
    fetchStudentData();
  }, []);

  // Calculate skill scores based on course performances
  const calculateSkillScores = (courses) => {
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
    // Get top 3 skills
    const topSkills = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([skill, _]) => skill);
    
    // Find electives that match top skills
    const recommendedElectiveCodes = new Set();
    
    Object.entries(careerPathMapping).forEach(([_, careerInfo]) => {
      // Check if career path aligns with top skills
      const matchingSkills = careerInfo.requiredSkills.filter(skill => 
        topSkills.includes(skill)
      );
      
      if (matchingSkills.length >= 2) {
        // Add recommended electives for this career path
        careerInfo.recommendedElectives.forEach(electiveCode => {
          // Only recommend if not already completed
          if (!completedCourses.includes(electiveCode)) {
            recommendedElectiveCodes.add(electiveCode);
          }
        });
      }
    });
    
    // Convert to array and fetch elective details
    return Array.from(recommendedElectiveCodes);
  };

  // Suggest career paths based on skill profile
  const suggestCareerPaths = (scores) => {
    const careerMatches = [];
    
    Object.entries(careerPathMapping).forEach(([career, careerInfo]) => {
      let matchScore = 0;
      let maxPossibleScore = 0;
      
      careerInfo.requiredSkills.forEach(skill => {
        matchScore += scores[skill] || 0;
        maxPossibleScore += 10; // Assuming max skill score is 10
      });
      
      // Calculate match percentage
      const matchPercentage = (matchScore / maxPossibleScore) * 100;
      
      if (matchPercentage > 60) { // Only suggest careers with >60% match
        careerMatches.push({
          career,
          matchPercentage,
          recommendedMasters: careerInfo.recommendedMasters
        });
      }
    });
    
    // Sort by match percentage (descending)
    return careerMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  if (isLoading) {
    return <div className="loading-container">Analyzing your performance...</div>;
  }

  return (
    <div className="performance-analyzer-container">
      <h1>Performance Analyzer</h1>
      <p className="subtitle">Discover your academic strengths and opportunities for growth</p>
      
      <div className="analyzer-dashboard">
        {/* Skill Radar Chart */}
        <div className="radar-chart-container">
          <h2>Your Skill Profile</h2>
          <SkillRadarChart skillScores={skillScores} categories={skillCategories} />
        </div>
        
        {/* Semester Progress Chart */}
        <div className="semester-progress-container">
          <h2>Semester Progression</h2>
          <SemesterProgressChart semesterData={studentData?.semesterData || []} />
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
      </div>
    </div>
  );
};

export default PerformanceAnalyzer;