from django.contrib import admin
from .models import Course, Resource, Note

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'credits', 'semester')
    search_fields = ('code', 'name')
    list_filter = ('semester',)

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'course', 'uploaded_by', 'uploaded_at')
    list_filter = ('type', 'course')
    search_fields = ('title', 'description')
    date_hierarchy = 'uploaded_at'

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'course', 'created_at')
    list_filter = ('course',)
    search_fields = ('title', 'content')
    date_hierarchy = 'created_at'