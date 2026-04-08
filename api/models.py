from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Post(models.Model):
    CATEGORY_CHOICES = [
        ('bat-dong-san', 'Tin tức'),
        ('do-dien-tu', 'Airdrop'),
        ('xe-co', 'Testnet'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='bat-dong-san')
    image = models.TextField(blank=True, null=True)  # Lưu URL hoặc Base64 image data
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.author.email if self.author else 'unknown'}"
