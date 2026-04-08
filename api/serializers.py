from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author_email = serializers.EmailField(source='author.email', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_email', 'title', 'content', 'category', 'category_display', 'image', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'author_email', 'category_display', 'created_at', 'updated_at']
