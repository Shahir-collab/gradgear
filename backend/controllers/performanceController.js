const db = require('../config/db');
const skillCalculator = require('../utils/skillCalculator');
const gpaPrediction = require('../utils/gpaPrediction');

// Get skill analysis for a user
exports.getSkillAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's skills proficiency
    const skillsQuery = `
      SELECT s.skill_name, ss.proficiency_score
      FROM student_skills ss
      JOIN skills s ON ss.skill_id = s.skill_id
      WHERE ss.user_id = $1
      ORDER BY ss.proficiency_score DESC
    `;
    
    const { rows: skills } = await db.query(skillsQuery, [userId]);
    
    // Calculate estimated hours to master each skill
    const skillsWithHours = skills.map(skill => {
      const currentProficiency = skill.proficiency_score;
      const hoursToMastery = skillCalculator.calculateHoursToMastery(currentProficiency);
      
      return {
        ...skill,
        hours_to_mastery: hoursToMastery
      };
    });
    
    // Separate skills into strengths and areas for improvement
    const strengths = skillsWithHours.filter(skill => skill.proficiency_score >= 2.0)
      .sort((a, b) => b.proficiency_score - a.proficiency_score)
      .slice(0, 3);
      
    const improvements = skillsWithHours.filter(skill => skill.proficiency_score < 2.0)
      .sort((a, b) => a.proficiency_score - b.proficiency_score)
      .slice(0, 3);
    
    // Get recommended resources for improvement areas
    const resourcePromises = improvements.map(async (skill) => {
      const resourceQuery = `
        SELECT r.resource_name, r.provider, r.url
        FROM resources r
        JOIN skill_resources sr ON r.resource_id = sr.resource_id
        JOIN skills s ON sr.skill_id = s.skill_id
        WHERE s.skill_name = $1
        ORDER BY sr.relevance_score DESC
        LIMIT 2
      `;
      
      const { rows: resources } = await db.query(resourceQuery, [skill.skill_name]);
      
      return {
        skill_name: skill.skill_name,
        proficiency_score: skill.proficiency_score,
        resources
      };
    });
    
    const improvementsWithResources = await Promise.all(resourcePromises);
    
    return res.json({
      strengths,
      areas_for_improvement: improvementsWithResources,
      all_skills: skillsWithHours
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get subject analysis for a user
exports.getSubjectAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's subject performance
    const subjectsQuery = `
      SELECT s.subject_code, s.subject_name, ss.total_marks, ss.grade, ss.grade_points
      FROM student_subjects ss
      JOIN subjects s ON ss.subject_id = s.subject_id
      WHERE ss.user_id = $1
      ORDER BY ss.created_at DESC
    `;
    
    const { rows: subjects } = await db.query(subjectsQuery, [userId]);
    
    // Categorize subjects
    const strongSubjects = subjects.filter(subject => subject.total_marks >= 80);
    const averageSubjects = subjects.filter(subject => subject.total_marks >= 60 && subject.total_marks < 80);
    const needsImprovementSubjects = subjects.filter(subject => subject.total_marks < 60);
    
    // Get subject category distribution
    const coreSubjectsQuery = `
      SELECT COUNT(*) as count
      FROM student_subjects ss
      JOIN subjects s ON ss.subject_id = s.subject_id
      WHERE ss.user_id = $1 AND s.subject_code LIKE '%-CORE-%'
    `;
    
    const electiveSubjectsQuery = `
      SELECT COUNT(*) as count
      FROM student_subjects ss
      JOIN subjects s ON ss.subject_id = s.subject_id
      WHERE ss.user_id = $1 AND s.subject_code LIKE '%-ELEC-%'
    `;
    
    const labSubjectsQuery = `
      SELECT COUNT(*) as count
      FROM student_subjects ss
      JOIN subjects s ON ss.subject_id = s.subject_id
      WHERE ss.user_id = $1 AND s.subject_code LIKE '%-LAB-%'
    `;
    
    const [coreResult, electiveResult, labResult] = await Promise.all([
      db.query(coreSubjectsQuery, [userId]),
      db.query(electiveSubjectsQuery, [userId]),
      db.query(labSubjectsQuery, [userId])
    ]);
    
    const categoryDistribution = {
      core: parseInt(coreResult.rows[0].count),
      elective: parseInt(electiveResult.rows[0].count),
      lab: parseInt(labResult.rows[0].count)
    };
    
    return res.json({
      subjects,
      performance_categories: {
        strong: strongSubjects,
        average: averageSubjects,
        needs_improvement: needsImprovementSubjects
      },
      category_distribution: categoryDistribution
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get GPA prediction for a user
exports.getGpaPrediction = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's semester GPAs
    const semesterQuery = `
      SELECT semester_number, cgpa
      FROM semesters
      WHERE user_id = $1 AND completed = true
      ORDER BY semester_number
    `;
    
    const { rows: semesters } = await db.query(semesterQuery, [userId]);
    
    if (semesters.length < 2) {
      return res.status(400).json({ 
        error: 'Not enough data for prediction',
        message: 'You need at least 2 completed semesters for GPA prediction'
      });
    }
    
    // Use the GPA prediction utility to predict future semesters
    const currentSemester = Math.max(...semesters.map(s => s.semester_number));
    const predictedSemesters = gpaPrediction.predictGPA(semesters, currentSemester + 1, 8);
    
    // Calculate confidence score based on consistency of past performance
    const confidenceScore = gpaPrediction.calculateConfidence(semesters);
    
    return res.json({
      actual_gpa: semesters,
      predicted_gpa: predictedSemesters,
      confidence_score: confidenceScore
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get recommended electives for a user
exports.getRecommendedElectives = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's current semester
    const userQuery = `
      SELECT current_semester, branch
      FROM users
      WHERE user_id = $1
    `;
    
    const { rows: users } = await db.query(userQuery, [userId]);
    const { current_semester, branch } = users[0];
    
    // Get user's top skills
    const skillsQuery = `
      SELECT s.skill_id, s.skill_name, ss.proficiency_score
      FROM student_skills ss
      JOIN skills s ON ss.skill_id = s.skill_id
      WHERE ss.user_id = $1
      ORDER BY ss.proficiency_score DESC
      LIMIT 5
    `;
    
    const { rows: topSkills } = await db.query(skillsQuery, [userId]);
    
    // Find electives that match user's top skills
    const electivesQuery = `
      SELECT e.elective_id, e.subject_code, e.subject_name, e.credits, e.description,
        SUM(es.weight * $1) as match_score
      FROM electives e
      JOIN elective_skills es ON e.elective_id = es.elective_id
      WHERE e.eligible_semester <= $2 AND e.branch = $3
      GROUP BY e.elective_id, e.subject_code, e.subject_name, e.credits, e.description
      ORDER BY match_score DESC
      LIMIT 5
    `;
    
    const electivePromises = topSkills.map(skill => {
      return db.query(electivesQuery, [skill.proficiency_score, current_semester + 1, branch]);
    });
    
    const electiveResults = await Promise.all(electivePromises);
    
    // Combine and deduplicate results
    let allElectives = [];
    electiveResults.forEach(result => {
      allElectives = [...allElectives, ...result.rows];
    });
    
    // Remove duplicates and sort by match score
    const uniqueElectives = Array.from(new Map(
      allElectives.map(elective => [elective.elective_id, elective])
    ).values()).sort((a, b) => b.match_score - a.match_score).slice(0, 3);
    
    // Format match scores as percentages
    const recommendedElectives = uniqueElectives.map(elective => {
      const matchPercentage = Math.min(Math.round(elective.match_score * 10), 100);
      return {
        ...elective,
        match_percentage: matchPercentage
      };
    });
    
    return res.json({
      recommended_electives: recommendedElectives
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get career path recommendations for a user
exports.getCareerPathRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's skills proficiency
    const skillsQuery = `
      SELECT s.skill_id, s.skill_name, ss.proficiency_score
      FROM student_skills ss
      JOIN skills s ON ss.skill_id = s.skill_id
      WHERE ss.user_id = $1
    `;
    
    const { rows: userSkills } = await db.query(skillsQuery, [userId]);
    
    // Calculate match scores for each career path
    const careerPathsQuery = `
      SELECT cp.career_path_id, cp.path_name, cp.description
      FROM career_paths cp
    `;
    
    const { rows: careerPaths } = await db.query(careerPathsQuery);
    
    const careerPathPromises = careerPaths.map(async (careerPath) => {
      const careerSkillsQuery = `
        SELECT cps.skill_id, cps.importance_weight, s.skill_name
        FROM career_path_skills cps
        JOIN skills s ON cps.skill_id = s.skill_id
        WHERE cps.career_path_id = $1
      `;
      
      const { rows: careerSkills } = await db.query(careerSkillsQuery, [careerPath.career_path_id]);
      
      // Calculate match score based on user's skills and career path requirements
      let totalMatchScore = 0;
      let totalPossibleScore = 0;
      
      careerSkills.forEach(careerSkill => {
        const userSkill = userSkills.find(us => us.skill_id === careerSkill.skill_id);
        const skillScore = userSkill ? userSkill.proficiency_score : 0;
        
        totalMatchScore += skillScore * careerSkill.importance_weight;
        totalPossibleScore += 10 * careerSkill.importance_weight; // 10 is max skill score
      });
      
      const matchPercentage = Math.round((totalMatchScore / totalPossibleScore) * 100);
      
      // Get recommended masters programs for this career path
      const programsQuery = `
        SELECT mp.program_id, mp.program_name, mp.university, mp.country
        FROM masters_programs mp
        JOIN career_path_programs cpp ON mp.program_id = cpp.program_id
        WHERE cpp.career_path_id = $1
        ORDER BY cpp.relevance_score DESC
        LIMIT 3
      `;
      
      const { rows: recommendedPrograms } = await db.query(programsQuery, [careerPath.career_path_id]);
      
      return {
        ...careerPath,
        match_percentage: matchPercentage,
        recommended_programs: recommendedPrograms
      };
    });
    
    const careerPathsWithScores = await Promise.all(careerPathPromises);
    
    // Sort by match percentage and take top 3
    const topCareerPaths = careerPathsWithScores
      .sort((a, b) => b.match_percentage - a.match_percentage)
      .slice(0, 3);
    
    return res.json({
      career_paths: topCareerPaths
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get comprehensive performance analysis
exports.getPerformanceAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all analysis data in parallel for efficiency
    const [skillAnalysis, subjectAnalysis, gpaPrediction, recommendedElectives, careerPaths] = await Promise.all([
      this.getSkillAnalysis({ user: { id: userId } }, { json: data => data }),
      this.getSubjectAnalysis({ user: { id: userId } }, { json: data => data }),
      this.getGpaPrediction({ user: { id: userId } }, { json: data => data }).catch(() => null),
      this.getRecommendedElectives({ user: { id: userId } }, { json: data => data }),
      this.getCareerPathRecommendations({ user: { id: userId } }, { json: data => data })
    ]);
    
    return res.json({
      skill_analysis: skillAnalysis,
      subject_analysis: subjectAnalysis,
      gpa_prediction: gpaPrediction,
      recommended_electives: recommendedElectives.recommended_electives,
      career_paths: careerPaths.career_paths
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
   // In performanceController.js, add this new endpoint
   
   exports.recalculatePerformance = async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Get all subject performance for this user
      const { rows: subjects } = await db.query(
        'SELECT * FROM student_subjects WHERE user_id = $1',
        [userId]
      );
      
      // Get subject-skill mappings
      const { rows: mappings } = await db.query(
        'SELECT * FROM subject_skills'
      );
      
      // Calculate skill proficiencies
      const skillProficiencies = skillCalculator.calculateSkillProficiency(subjects, mappings);
      
      // Update student_skills table
      for (const skill of skillProficiencies) {
        await db.query(
          `INSERT INTO student_skills (user_id, skill_id, proficiency_score)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id, skill_id) 
           DO UPDATE SET proficiency_score = $3, last_calculated_at = NOW()`,
          [userId, skill.skill_id, skill.proficiency_score]
        );
      }
      
      return res.status(200).json({ message: 'Performance data recalculated successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };