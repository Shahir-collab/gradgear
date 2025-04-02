// File: /frontend/src/config/skillMappingConfig.js

// Subject-Skill Mapping Schema
export const subjectSkillMapping = {
    "19-202-0302": { // Logic Design
      primarySkills: ["theoretical_knowledge", "design_thinking", "hardware_understanding"],
      secondarySkills: ["problem_solving", "analytical_thinking"],
      weightage: {
        theoretical_knowledge: 0.4,
        design_thinking: 0.3,
        hardware_understanding: 0.2,
        problem_solving: 0.05,
        analytical_thinking: 0.05
      }
    },
    "19-202-0405": { // Data Structures and Algorithms
      primarySkills: ["coding_ability", "analytical_thinking", "problem_solving"],
      secondarySkills: ["theoretical_knowledge", "logical_reasoning"],
      weightage: {
        coding_ability: 0.4,
        analytical_thinking: 0.3,
        problem_solving: 0.2,
        theoretical_knowledge: 0.05,
        logical_reasoning: 0.05
      }
    }
    // Additional subject mappings...
  };
  
  // Skill Categories
  export const skillCategories = {
    technical: [
      "coding_ability", 
      "hardware_understanding", 
      "software_design", 
      "database_management"
    ],
    analytical: [
      "problem_solving", 
      "analytical_thinking", 
      "logical_reasoning", 
      "mathematical_aptitude"
    ],
    theoretical: [
      "theoretical_knowledge", 
      "research_aptitude", 
      "academic_writing"
    ],
    design: [
      "design_thinking", 
      "user_experience", 
      "creative_problem_solving"
    ]
  };
  
  // Career Path Mapping
  export const careerPathMapping = {
    "Machine Learning Engineer": {
      requiredSkills: ["mathematical_aptitude", "coding_ability", "analytical_thinking"],
      recommendedElectives: ["19-202-0507", "19-202-0606", "19-202-0802"],
      recommendedMasters: ["MS in Machine Learning", "MS in Artificial Intelligence"]
    },
    "System Architect": {
      requiredSkills: ["design_thinking", "software_design", "hardware_understanding"],
      recommendedElectives: ["19-202-0505", "19-202-0806", "19-202-0810"],
      recommendedMasters: ["MS in Computer Architecture", "MS in Systems Engineering"]
    }
    // Additional career paths...
  };