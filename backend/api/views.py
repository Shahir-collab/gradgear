# File: backend/api/views.py

from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import numpy as np
from sklearn.linear_model import LinearRegression
import pandas as pd
import joblib
import os
from datetime import datetime

# Path to save the trained model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml_models', 'gpa_predictor.joblib')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_final_gpa(request):
    """
    Predict final semester GPA based on previous semester GPAs
    """
    try:
        # Extract semester data from request
        semester_data = request.data.get('semesterData', [])
        
        # Validate input data
        if not semester_data or len(semester_data) < 2:
            return Response(
                {"error": "Insufficient data. At least 2 semesters of GPA data required for prediction."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Extract semester numbers and GPAs
        semesters = [entry.get('semester') for entry in semester_data]
        gpas = [entry.get('gpa') for entry in semester_data]
        
        # Validate that we have numeric data
        if not all(isinstance(s, int) for s in semesters) or not all(isinstance(g, (int, float)) for g in gpas):
            return Response(
                {"error": "Invalid data format. Semester should be integer and GPA should be numeric."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare data for prediction
        X = np.array(semesters).reshape(-1, 1)  # Independent variable (semester number)
        y = np.array(gpas)  # Dependent variable (GPA)
        
        # Train linear regression model
        model = LinearRegression()
        model.fit(X, y)
        
        # Save the model for future use
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        joblib.dump(model, MODEL_PATH)
        
        # Predict GPA for remaining semesters up to 8
        remaining_semesters = list(range(max(semesters) + 1, 9))
        
        if not remaining_semesters:
            return Response(
                {"message": "All 8 semesters already completed, no prediction needed."},
                status=status.HTTP_200_OK
            )
        
        X_predict = np.array(remaining_semesters).reshape(-1, 1)
        predicted_gpas = model.predict(X_predict)
        
        # Calculate confidence metrics
        r_squared = model.score(X, y)
        
        # Prepare response data
        prediction_data = {
            "current_semesters": semester_data,
            "predicted_semesters": [
                {"semester": sem, "predicted_gpa": round(gpa, 2)} 
                for sem, gpa in zip(remaining_semesters, predicted_gpas)
            ],
            "confidence": round(r_squared * 100, 2),
            "model_coefficients": {
                "slope": round(float(model.coef_[0]), 4),
                "intercept": round(float(model.intercept_), 4)
            },
            "timestamp": datetime.now().isoformat()
        }
        
        return Response(prediction_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        # Log the error for debugging
        print(f"Error in GPA prediction: {str(e)}")
        return Response(
            {"error": "An error occurred during prediction. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_prediction_accuracy(request):
    """
    Get accuracy metrics for the GPA prediction model
    """
    try:
        # Check if model exists
        if not os.path.exists(MODEL_PATH):
            return Response(
                {"error": "No prediction model found. Make predictions first."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        # Load the model
        model = joblib.load(MODEL_PATH)
        
        # Get historical prediction data for this user
        # In a real implementation, this would come from a database
        # For now, we'll return some mock data
        
        accuracy_data = {
            "model_type": "Linear Regression",
            "last_trained": "2023-08-15T14:30:00",
            "mean_absolute_error": 0.35,
            "accuracy_percentage": 85,
            "sample_size": 250
        }
        
        return Response(accuracy_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"Error retrieving model accuracy: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )