from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Post
from .serializers import PostSerializer

class IsAuthorOfPost(permissions.BasePermission):
    """
    Custom permission: Chỉ cho phép tác giả xóa/chỉnh sửa bài của mình
    """
    def has_object_permission(self, request, view, obj):
        # Chỉ author mới có thể xóa/sửa
        return obj.author == request.user

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer

    def get_permissions(self):
        """
        Cho phép tất cả người dùng xem posts,
        nhưng chỉ authenticated users mới có thể tạo/sửa/xóa
        """
        if self.action in ['list', 'retrieve']:
            # Cho phép tất cả người dùng xem
            permission_classes = [permissions.AllowAny]
        elif self.action == 'destroy':
            # Ai đăng nhập cũng có thể xóa bài
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update']:
            # Cần authentication và phải là author để sửa bài
            permission_classes = [permissions.IsAuthenticated, IsAuthorOfPost]
        else:
            # Cần authentication để tạo
            permission_classes = [permissions.IsAuthenticated]
        print(f"[API] {self.action} requires: {[p.__class__.__name__ for p in [permission() for permission in permission_classes]]}")
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        print(f"[API] perform_create called")
        print(f"[API] Request user: {self.request.user}")
        print(f"[API] Is authenticated: {self.request.user.is_authenticated}")
        print(f"[API] Post data: {serializer.validated_data}")
        serializer.save(author=self.request.user)
        print(f"[API] Post saved with ID: {serializer.instance.id}")

