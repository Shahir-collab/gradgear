   // File: src/components/PerformanceAnalyzer/SkillRadarChart.js
   import React from 'react';
   import { Chart as ChartJS, RadarController, LineElement, PointElement, RadialLinearScale, Tooltip, Legend } from 'chart.js';
   import { Radar } from 'react-chartjs-2';
   import './SkillRadarChart.css';

   // Register required Chart.js components
   ChartJS.register(RadarController, LineElement, PointElement, RadialLinearScale, Tooltip, Legend);

   const SkillRadarChart = ({ skillScores, categories, showDistribution = true }) => {
     // Prepare data for radar chart
     const prepareChartData = () => {
       // Get skills with scores
       const skills = Object.keys(skillScores).filter(skill => skillScores[skill] > 0);
       const labels = skills.map(skill => 
         skill.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
       );
       const data = skills.map(skill => skillScores[skill]);
       
       return {
         labels,
         datasets: [{
           label: 'Skill Proficiency',
           data,
           backgroundColor: 'rgba(75, 192, 192, 0.2)',
           borderColor: 'rgba(75, 192, 192, 1)',
           borderWidth: 2,
           pointBackgroundColor: 'rgba(75, 192, 192, 1)',
           pointRadius: 4
         }]
       };
     };

     const chartData = prepareChartData();
     
     const chartOptions = {
       scales: {
         r: {
           angleLines: {
             display: true,
             color: 'rgba(255, 255, 255, 0.15)'
           },
           suggestedMin: 0,
           suggestedMax: 10
         }
       },
       maintainAspectRatio: false
     };

     return (
       <div>
         <div className="chart-section">
           <h3>Estimated Hours to Master Skills</h3>
           <div className="bar-container">
             <p>This chart estimates the hours needed to improve each skill to mastery level (10/10), based on your current proficiency.</p>
           </div>
         </div>
       </div>
     );
   };

   export default SkillRadarChart;