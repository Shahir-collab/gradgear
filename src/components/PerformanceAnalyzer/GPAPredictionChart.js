// File: src/components/PerformanceAnalyzer/GPAPredictionChart.js

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './GPAPredictionChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GPAPredictionChart = ({ semesterData, predictedData, confidenceScore }) => {
  // Prepare data for the chart
  const labels = [...semesterData.map(d => `Semester ${d.semester}`), ...predictedData.map(d => `Semester ${d.semester}`)];
  
  const actualData = semesterData.map(d => d.gpa);
  const predictedGpas = predictedData.map(d => d.gpa);
  
  // Add null values to create a gap between actual and predicted data
  const actualDataWithGap = [...actualData, ...Array(predictedGpas.length).fill(null)];
  const predictedDataWithGap = [...Array(actualData.length).fill(null), ...predictedGpas];
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Actual GPA',
        data: actualDataWithGap,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointRadius: 5,
        tension: 0.1
      },
      {
        label: 'Predicted GPA',
        data: predictedDataWithGap,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        pointBackgroundColor: 'rgba(255, 159, 64, 1)',
        pointBorderColor: '#fff',
        pointRadius: 5,
        borderDash: [5, 5],
        tension: 0.1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 10,
        ticks: {
          color: '#a0a0a0',
          stepSize: 1
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        title: {
          display: true,
          text: 'GPA',
          color: '#e0e0e0'
        }
      },
      x: {
        ticks: {
          color: '#a0a0a0'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e0e0e0'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#e0e0e0'
      }
    }
  };

  return (
    <div className="gpa-prediction-container">
      <div className="chart-header">
        <h3>GPA Trend & Prediction</h3>
        <div className="confidence-indicator">
          <span className="confidence-label">Prediction Confidence:</span>
          <div className="confidence-meter">
            <div 
              className="confidence-fill" 
              style={{ 
                width: `${confidenceScore}%`,
                backgroundColor: confidenceScore > 70 ? '#4caf50' : confidenceScore > 40 ? '#ff9800' : '#f44336'
              }}
            ></div>
          </div>
          <span className="confidence-value">{confidenceScore}%</span>
        </div>
      </div>
      
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="prediction-explanation">
        <p>
          <strong>How this works:</strong> This prediction uses a linear regression model based on your past semester 
          performance to estimate future GPA. The confidence score indicates the reliability of the prediction based 
          on the consistency of your past performance.
        </p>
        <p>
          <strong>Note:</strong> This is a statistical projection and actual results may vary based on course difficulty, 
          study habits, and other factors.
        </p>
      </div>
    </div>
  );
};

export default GPAPredictionChart;