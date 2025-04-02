// File: /frontend/src/components/PerformanceAnalyzer/RecommendationPanel.js

import React from 'react';
import './RecommendationPanel.css';

const RecommendationPanel = ({ strengths, weaknesses }) => {
  // Generate improvement recommendations based on weaknesses
  const generateImprovementRecommendations = () => {
    const recommendations = [];
    
    weaknesses.forEach(({ skill, score }) => {
      const formattedSkill = formatSkillName(skill);
      
      switch(skill) {
        case 'coding_ability':
          recommendations.push({
            title: `Enhance Your ${formattedSkill}`,
            description: 'Consider dedicating time to coding practice platforms like LeetCode or HackerRank. Focus on implementing algorithms from your DSA courses in practice problems.',
            resources: [
              { name: 'LeetCode', url: 'https://leetcode.com/' },
              { name: 'HackerRank', url: 'https://www.hackerrank.com/' },
              { name: 'CodeSignal', url: 'https://codesignal.com/' }
            ]
          });
          break;
          
        case 'theoretical_knowledge':
          recommendations.push({
            title: `Strengthen Your ${formattedSkill}`,
            description: 'Create concept maps connecting related topics and review foundational concepts. Consider joining study groups to discuss theoretical concepts with peers.',
            resources: [
              { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/' },
              { name: 'Khan Academy', url: 'https://www.khanacademy.org/' }
            ]
          });
          break;
          
        case 'analytical_thinking':
          recommendations.push({
            title: `Develop Your ${formattedSkill}`,
            description: 'Practice breaking down complex problems into smaller components. Work on case studies and puzzles that require analytical reasoning.',
            resources: [
              { name: 'Brilliant.org', url: 'https://brilliant.org/' },
              { name: 'Case Study Analysis Guides', url: 'https://www.mindtools.com/pages/article/newTMC_88.htm' }
            ]
          });
          break;
          
        case 'design_thinking':
          recommendations.push({
            title: `Improve Your ${formattedSkill}`,
            description: 'Explore design patterns and principles. Practice designing solutions for real-world problems and get feedback from peers or mentors.',
            resources: [
              { name: 'Interaction Design Foundation', url: 'https://www.interaction-design.org/' },
              { name: 'Design Patterns Book', url: 'https://refactoring.guru/design-patterns/book' }
            ]
          });
          break;
          
        default:
          recommendations.push({
            title: `Develop Your ${formattedSkill}`,
            description: 'Consider seeking additional resources and practice opportunities to strengthen this skill area.',
            resources: [
              { name: 'Coursera', url: 'https://www.coursera.org/' },
              { name: 'edX', url: 'https://www.edx.org/' }
            ]
          });
      }
    });
    
    return recommendations;
  };
  
  // Format skill name for display
  const formatSkillName = (skill) => {
    return skill
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const improvementRecommendations = generateImprovementRecommendations();

  return (
    <div className="recommendation-panel">
      <div className="strengths-section">
        <h3>Your Strengths</h3>
        <ul className="strength-list">
          {strengths.map((strength, index) => (
            <li key={`strength-${index}`} className="strength-item">
              <div className="strength-header">
                <span className="strength-name">{formatSkillName(strength.skill)}</span>
                <span className="strength-score">{strength.score.toFixed(1)}/10</span>
              </div>
              <p className="strength-description">
                You demonstrate strong {formatSkillName(strength.skill)}. This is a valuable skill in 
                {strength.category === 'technical' 
                  ? ' technical roles like Software Development and System Architecture.' 
                  : strength.category === 'analytical' 
                    ? ' analytical fields like Data Science and Algorithm Development.'
                    : strength.category === 'theoretical'
                      ? ' research-oriented positions and advanced academic pursuits.'
                      : ' creative and design-focused roles.'}
              </p>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="improvement-section">
        <h3>Areas for Improvement</h3>
        {improvementRecommendations.map((recommendation, index) => (
          <div key={`rec-${index}`} className="recommendation-card">
            <h4>{recommendation.title}</h4>
            <p>{recommendation.description}</p>
            
            {recommendation.resources && (
              <div className="recommendation-resources">
                <strong>Recommended Resources:</strong>
                <ul>
                  {recommendation.resources.map((resource, rIndex) => (
                    <li key={`resource-${index}-${rIndex}`}>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        {resource.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationPanel;