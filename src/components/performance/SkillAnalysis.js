// src/components/performance/SkillAnalysis.js
import React from 'react';
import SkillCard from '../common/SkillCard';
import './SkillAnalysis.css';

const SkillAnalysis = ({ data }) => {
  if (!data) return <div>No skill data available</div>;

  const { strengths, areas_for_improvement, all_skills } = data;

  return (
    <div className="skill-analysis">
      <h2>Your Skill Profile</h2>
      
      <div className="hours-to-master-section">
        <h3>Estimated Hours to Master Skills</h3>
        <p className="description">
          This chart estimates the hours needed to improve each skill to mastery
          level (10/10), based on your current proficiency.
        </p>
        
        <div className="skills-chart">
          {all_skills.map((skill, index) => (
            <div className="skill-bar-container" key={index}>
              <div className="skill-name">{skill.skill_name}</div>
              <div className="skill-bar-wrapper">
                <div 
                  className="skill-bar" 
                  style={{ 
                    width: `${(skill.hours_to_mastery / 500) * 100}%`,
                    backgroundColor: skill.proficiency_score > 2 ? '#4CAF50' : '#FF5252'
                  }}
                ></div>
                <span className="hours-label">{skill.hours_to_mastery} hours</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="skill-overview">
        <div className="strengths-section">
          <h3>Your Strengths</h3>
          {strengths.map((skill, index) => (
            <div className="strength-item" key={index}>
              <div className="skill-name">{skill.skill_name}</div>
              <div className="skill-score">{skill.proficiency_score.toFixed(1)}/10</div>
            </div>
          ))}
        </div>
        
        <div className="improvement-section">
          <h3>Areas for Improvement</h3>
          {areas_for_improvement.map((item, index) => (
            <div className="improvement-item" key={index}>
              <div className="improvement-header">
                <div className="skill-name">{item.skill_name}</div>
                <div className="skill-score">{item.proficiency_score.toFixed(1)}/10</div>
              </div>
              
              <div className="improvement-resources">
                <p>Develop Your {item.skill_name}</p>
                <p className="resource-description">
                  Consider seeking additional resources and practice opportunities to strengthen this skill area.
                </p>
                
                <div className="recommended-resources">
                  <h4>Recommended Resources:</h4>
                  <ul>
                    {item.resources.map((resource, idx) => (
                      <li key={idx}>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          {resource.provider} - {resource.resource_name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillAnalysis;