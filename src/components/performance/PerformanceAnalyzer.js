// src/components/performance/PerformanceAnalyzer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnalysisNavigation from './AnalysisNavigation';
import SkillAnalysis from './SkillAnalysis';
import SubjectAnalysis from './SubjectAnalysis';
import GPAPrediction from './GPAPrediction';
import RecommendedElectives from './RecommendedElectives';
import CareerPaths from './CareerPaths';
import { getPerformanceAnalysis } from '../../services/performanceService';
import './PerformanceAnalyzer.css';

const PerformanceAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('skill');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPerformanceAnalysis();
        setAnalysisData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load performance data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div className="loading-spinner">Loading your analysis...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (!analysisData) {
      return <div className="no-data-message">No performance data available yet.</div>;
    }

    switch (activeTab) {
      case 'skill':
        return <SkillAnalysis data={analysisData.skill_analysis} />;
      case 'subject':
        return <SubjectAnalysis data={analysisData.subject_analysis} />;
      case 'gpa':
        return <GPAPrediction data={analysisData.gpa_prediction} />;
      default:
        return <SkillAnalysis data={analysisData.skill_analysis} />;
    }
  };

  return (
    <div className="performance-analyzer">
      <div className="analyzer-header">
        <h1>Performance Analyzer</h1>
        <p className="analyzer-description">
          Discover your academic strengths and opportunities for growth
        </p>
      </div>

      <AnalysisNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="analyzer-content">
        {renderContent()}
      </div>

      {analysisData && (
        <div className="recommendations-section">
          <RecommendedElectives electives={analysisData.recommended_electives} />
          <CareerPaths careerPaths={analysisData.career_paths} />
        </div>
      )}
    </div>
  );
};

export default PerformanceAnalyzer;