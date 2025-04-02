# core/adapters.py
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.core.exceptions import ValidationError

class CUSATSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        # Get the email from the social account
        email = sociallogin.account.extra_data.get('email', '')
        
        # Check if it's a CUSAT email
        if not email.endswith('@ug.cusat.ac.in'):
            raise ValidationError("Please use your CUSAT email address to log in.")
        
        return super().pre_social_login(request, sociallogin)