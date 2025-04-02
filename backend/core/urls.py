# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ResourceViewSet, NoteViewSet, calculate_sgpa

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = [
    path('', include(router.urls)),
    path('calculate-sgpa/', calculate_sgpa, name='calculate-sgpa'),
]

from django.urls import path
from . import views
from django.urls import path
from . import views



urlpatterns = [
    # Existing URLs...
    path('predict-gpa/', views.predict_final_gpa, name='predict_gpa'),
    path('prediction-accuracy/', views.get_prediction_accuracy, name='prediction_accuracy'),
]