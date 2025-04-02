// File: src/services/predictionService.js

// Simple linear regression implementation for frontend
export const predictRemainingGPA = (semesterData) => {
    // Need at least 2 data points for prediction
    if (!semesterData || semesterData.length < 2) {
      throw new Error("Insufficient data for prediction");
    }
    
    // Extract x (semester) and y (GPA) values
    const x = semesterData.map(d => d.semester);
    const y = semesterData.map(d => d.gpa);
    
    // Calculate means
    const meanX = x.reduce((sum, val) => sum + val, 0) / x.length;
    const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;
    
    // Calculate slope (m) and y-intercept (b) for line equation y = mx + b
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < x.length; i++) {
      numerator += (x[i] - meanX) * (y[i] - meanY);
      denominator += Math.pow(x[i] - meanX, 2);
    }
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    // Calculate R-squared (coefficient of determination)
    let totalVariation = 0;
    let explainedVariation = 0;
    
    for (let i = 0; i < y.length; i++) {
      totalVariation += Math.pow(y[i] - meanY, 2);
      const predicted = slope * x[i] + intercept;
      explainedVariation += Math.pow(predicted - meanY, 2);
    }
    
    const rSquared = explainedVariation / totalVariation;
    
    // Predict remaining semesters up to 8
    const lastSemester = Math.max(...x);
    const predictedSemesters = [];
    
    for (let semester = lastSemester + 1; semester <= 8; semester++) {
      const predictedGPA = slope * semester + intercept;
      // Ensure GPA is within valid range (0-10)
      const clampedGPA = Math.min(Math.max(predictedGPA, 0), 10);
      
      predictedSemesters.push({
        semester,
        gpa: parseFloat(clampedGPA.toFixed(2))
      });
    }
    
    return {
      predictedSemesters,
      confidenceScore: Math.round(rSquared * 100),
      model: {
        slope,
        intercept
      }
    };
  };