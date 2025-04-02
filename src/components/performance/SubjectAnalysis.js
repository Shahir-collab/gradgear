// src/components/performance/SubjectAnalysis.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './SubjectAnalysis.css';

const SubjectAnalysis = ({ data }) => {
  if (!data) return <div>No subject data available</div>;

  const { subjects, performance_categories, category_distribution } = data;

  // Prepare data for bar chart
  const barChartData = subjects.map(subject => ({
    name: subject.subject_code,
    score: subject.total_marks
  }));

  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Core', value: category_distribution.core },
    { name: 'Elective', value: category_distribution.elective },
    { name: 'Lab', value: category_distribution.lab }
  ];

  const COLORS = ['#4CAF50', '#FF9800', '#2196F3'];

  return (
    <div className="subject-analysis">
      <h2>Subject Performance Analysis</h2>
      
      <div className="subject-overview">
        <h3>Subject Performance Overview</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar 
                dataKey="score" 
                fill="#4CAF50" 
                radius={[5, 5, 0, 0]}
                label={{ position: 'top' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="performance-categories">
          <div className="category strong">Strong (≥80%)</div>
          <div className="category average">Average (60-79%)</div>
          <div className="category needs-improvement">Needs Improvement (&lt;60%)</div>
        </div>
      </div>
      
      <div className="subject-distribution">
        <h3>Subject Category Distribution</h3>
        <div className="pie-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="subject-details">
        <h3>Subject Details</h3>
        <div className="subject-cards">
          {performance_categories.strong.map((subject, index) => (
            <div className="subject-card strong" key={index}>
              <h4>{subject.subject_name}</h4>
              <p>Code: {subject.subject_code}</p>
              <p className="subject-grade">Grade: {subject.grade}</p>
              <p className="subject-score">Score: {subject.total_marks}%</p>
            </div>
          ))}
          
          {performance_categories.average.map((subject, index) => (
            <div className="subject-card average" key={index}>
              <h4>{subject.subject_name}</h4>
              <p>Code: {subject.subject_code}</p>
              <p className="subject-grade">Grade: {subject.grade}</p>
              <p className="subject-score">Score: {subject.total_marks}%</p>
            </div>
          ))}
          
          {performance_categories.needs_improvement.map((subject, index) => (
            <div className="subject-card needs-improvement" key={index}>
              <h4>{subject.subject_name}</h4>
              <p>Code: {subject.subject_code}</p>
              <p className="subject-grade">Grade: {subject.grade}</p>
              <p className="subject-score">Score: {subject.total_marks}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectAnalysis;