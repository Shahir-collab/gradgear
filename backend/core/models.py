# core/models.py
from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    code = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    credits = models.IntegerField()
    semester = models.IntegerField()
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class Resource(models.Model):
    RESOURCE_TYPES = [
        ('PDF', 'PDF'),
        ('DOC', 'Document'),
        ('PPT', 'Presentation'),
        ('VID', 'Video'),
        ('ZIP', 'Archive')
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='resources/')
    type = models.CharField(max_length=3, choices=RESOURCE_TYPES)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='resources')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class Note(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title