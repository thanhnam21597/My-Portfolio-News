#!/usr/bin/env python
"""
Script to create auth tokens for all users
Run with: python create_tokens.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

# Create tokens for all users
users = User.objects.all()
for user in users:
    token, created = Token.objects.get_or_create(user=user)
    if created:
        print(f"✅ Created token for user: {user.username}")
    else:
        print(f"⚠️  Token already exists for user: {user.username}")

print(f"\n✅ Total users: {users.count()}")
print(f"✅ Total tokens: {Token.objects.count()}")
