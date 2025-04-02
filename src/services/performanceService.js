// src/services/performanceService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getPerformanceAnalysis = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/performance/analysis`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching performance analysis:', error);
    throw error;
  }
};

export const getSkillAnalysis = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/performance/skills`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching skill analysis:', error);
    throw error;
  }
};

export const getSubjectAnalysis = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/performance/subjects`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching subject analysis:', error);
    throw error;
  }
};

export const getGpaPrediction = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/performance/gpa-prediction`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching GPA prediction:', error);
    throw error;
  }
};

export const getRecommendedElectives = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/performance/recommended-electives`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended electives:', error);
    throw error;
  }
};

export const getCareerPathRecommendations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/performance/career-paths`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching career path recommendations:', error);
    throw error;
  }
};