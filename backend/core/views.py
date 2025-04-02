# core/views.py
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Course, Resource, Note
from .serializers import CourseSerializer, ResourceSerializer, NoteSerializer

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    
    def get_queryset(self):
        return Resource.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    
    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
def calculate_sgpa(request):
    """
    Calculate SGPA based on CUSAT grading system
    Expected input format:
    {
        "courses": [
            {"code": "MA101", "credits": 4, "grade": "S"},
            {"code": "CS101", "credits": 3, "grade": "A"}
        ]
    }
    """
    grade_points = {
        'S': 10,
        'A': 9,
        'B': 8,
        'C': 7,
        'D': 6,
        'E': 5,
        'F': 0
    }
    
    courses = request.data.get('courses', [])
    
    total_credits = 0
    total_grade_points = 0
    
    for course in courses:
        credits = course.get('credits', 0)
        grade = course.get('grade', '')
        
        if grade in grade_points:
            total_credits += credits
            total_grade_points += credits * grade_points[grade]
    
    if total_credits == 0:
        sgpa = 0
    else:
        sgpa = total_grade_points / total_credits
        
    return Response({
        'sgpa': round(sgpa, 2),
        'total_credits': total_credits,
        'total_grade_points': total_grade_points
    })

# core/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
import jwt
import datetime

@api_view(['POST'])
def google_login(request):
    try:
        token = request.data.get('token')
        
        # Verify the Google token
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
        )
        
        # Get user information
        email = idinfo['email']
        name = idinfo.get('name', '')
        
        # Check if it's a CUSAT email (uncomment for production)
        # if not email.endswith('@cusat.ac.in'):
        #     return Response(
        #         {"error": "Please use your CUSAT email address to log in."},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
        
        # Get or create the user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': name.split(' ')[0] if name else '',
                'last_name': ' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else '',
            }
        )
        
        # Create a JWT token for the user
        payload = {
            'user_id': user.id,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
            'iat': datetime.datetime.utcnow()
        }
        
        # Use Django's secret key to sign the token
        jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        
        # Return the token and user info
        return Response({
            'token': jwt_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': name,
            }
        })
        
    except Exception as e:
        return Response(
            {"error": f"Login failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )