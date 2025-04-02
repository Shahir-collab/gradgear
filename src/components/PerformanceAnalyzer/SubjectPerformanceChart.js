// File: /src/components/PerformanceAnalyzer/SubjectPerformanceChart.js

import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './SubjectPerformanceChart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SubjectPerformanceChart = ({ subjectData }) => {
  // Performance Bar Chart Data
  const preparePerformanceData = () => {
    return {
      labels: subjectData.map(subject => subject.code),
      datasets: [
        {
          label: 'Performance Score (%)',
          data: subjectData.map(subject => subject.score),
          backgroundColor: subjectData.map(subject => 
            subject.score >= 80 ? 'rgba(76, 175, 80, 0.7)' : 
            subject.score >= 60 ? 'rgba(255, 193, 7, 0.7)' : 
            'rgba(244, 67, 54, 0.7)'
          ),
          borderColor: subjectData.map(subject => 
            subject.score >= 80 ? 'rgb(76, 175, 80)' : 
            subject.score >= 60 ? 'rgb(255, 193, 7)' : 
            'rgb(244, 67, 54)'
          ),
          borderWidth: 1
        }
      ]
    };
  };

  // Hours to Master Bar Chart Data
  const prepareHoursData = () => {
    return {
      labels: subjectData.map(subject => subject.code),
      datasets: [
        {
          label: 'Estimated Hours to Master',
          data: subjectData.map(subject => Math.round((100 - subject.score) * 0.5)),
          backgroundColor: 'rgba(33, 150, 243, 0.7)',
          borderColor: 'rgb(33, 150, 243)',
          borderWidth: 1
        }
      ]
    };
  };

  // Category Distribution Pie Chart Data
  const prepareCategoryData = () => {
    // Group subjects by category
    const categoryCount = {};
    
    subjectData.forEach(subject => {
      if (!categoryCount[subject.category]) {
        categoryCount[subject.category] = 0;
      }
      categoryCount[subject.category]++;
    });
    
    return {
      labels: Object.keys(categoryCount),
      datasets: [
        {
          data: Object.values(categoryCount),
          backgroundColor: [
            'rgba(76, 175, 80, 0.7)',
            'rgba(33, 150, 243, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(244, 67, 54, 0.7)'
          ],
          borderColor: [
            'rgb(76, 175, 80)',
            'rgb(33, 150, 243)',
            'rgb(255, 193, 7)',
            'rgb(244, 67, 54)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Performance Trend Line Chart Data
  const prepareTrendData = () => {
    // Group subjects by semester
    const subjectsBySemester = {};
    
    subjectData.forEach(subject => {
      if (subject.semester) {
        if (!subjectsBySemester[subject.semester]) {
          subjectsBySemester[subject.semester] = [];
        }
        subjectsBySemester[subject.semester].push(subject);
      }
    });
    
    // Calculate average score per semester
    const semesters = Object.keys(subjectsBySemester).sort((a, b) => a - b);
    const averageScores = semesters.map(semester => {
      const subjects = subjectsBySemester[semester];
      const total = subjects.reduce((sum, subject) => sum + subject.score, 0);
      return total / subjects.length;
    });
    
    return {
      labels: semesters.map(sem => `Semester ${sem}`),
      datasets: [
        {
          label: 'Average Score Trend',
          data: averageScores,
          borderColor: 'rgb(76, 175, 80)',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  };

  const performanceData = preparePerformanceData();
  const hoursData = prepareHoursData();
  const categoryData = prepareCategoryData();
  const trendData = prepareTrendData();

  // Chart Options
  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#a0a0a0'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#a0a0a0'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#e0e0e0'
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const subjectIndex = context.dataIndex;
            return `Subject: ${subjectData[subjectIndex].name}`;
          }
        },
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#e0e0e0'
      }
    },
    maintainAspectRatio: false
  };

  const performanceOptions = {
    ...barOptions,
    scales: {
      ...barOptions.scales,
      y: {
        ...barOptions.scales.y,
        max: 100,
        title: {
          display: true,
          text: 'Score (%)',
          color: '#e0e0e0'
        }
      }
    }
  };

  const hoursOptions = {
    ...barOptions,
    scales: {
      ...barOptions.scales,
      y: {
        ...barOptions.scales.y,
        title: {
          display: true,
          text: 'Hours',
          color: '#e0e0e0'
        }
      }
    }
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e0e0e0'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#e0e0e0'
      }
    },
    maintainAspectRatio: false
  };

  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#a0a0a0'
        },
        title: {
          display: true,
          text: 'Average Score (%)',
          color: '#e0e0e0'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#a0a0a0'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#e0e0e0'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#e0e0e0'
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="subject-performance-charts">
      <div className="chart-section">
        <h3>Subject Performance Overview</h3>
        <div className="chart-wrapper">
          <Bar data={performanceData} options={performanceOptions} />
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color" style={{backgroundColor: 'rgb(76, 175, 80)'}}></span>
            <span className="legend-text">Strong (≥80%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{backgroundColor: 'rgb(255, 193, 7)'}}></span>
            <span className="legend-text">Average (60-79%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{backgroundColor: 'rgb(244, 67, 54)'}}></span>
            <span className="legend-text">Needs Improvement (&lt;60%)</span>
          </div>
        </div>
      </div>
      
      <div className="charts-row">
        <div className="chart-section half-width">
          <h3>Subject Category Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={categoryData} options={pieOptions} />
          </div>
        </div>
        
        <div className="chart-section half-width">
          <h3>Performance Trend</h3>
          <div className="chart-wrapper">
            <Line data={trendData} options={lineOptions} />
          </div>
        </div>
      </div>
      
      <div className="chart-section">
        <h3>Estimated Hours to Master Subjects</h3>
        <div className="chart-wrapper">
          <Bar data={hoursData} options={hoursOptions} />
        </div>
        <div className="chart-description">
          <p>This chart estimates the number of additional study hours needed to achieve mastery in each subject, based on your current performance and typical learning curves.</p>
        </div>
      </div>
    </div>
  );
};

export default SubjectPerformanceChart;