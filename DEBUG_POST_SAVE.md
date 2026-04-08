# 🔍 Debug Checklist: Kiểm tra vì sao không lưu được bài viết

## Step 1: Kiểm tra Console (F12)

Sau khi đăng nhập, bạn sẽ thấy logs như thế này:

```
Login attempt with email: thanhnam.fit.iuh@gmail.com
Login response: {key: "token123...", user: {email: "..."}}
Token after login: 1655d075cc86...
User saved to localStorage: {email: "thanhnam.fit.iuh@gmail.com"}
CurrentUser state set to: {email: "thanhnam.fit.iuh@gmail.com"}
[API] GET /auth/user/ {hasToken: true}
Authorization header set: Token 1655d075...
```

## Step 2: Khi tạo bài viết, bạn sẽ thấy:

```
Creating post with data: {title: "...", content: "...", category: "bat-dong-san", image: null}
Current auth token: EXISTS
Current user: {currentUser: {email: "thanhnam.fit.iuh@gmail.com"}}
createPost - Token available: true
createPost - Sending request to /posts/
[API] POST /posts/ {hasToken: true}
Authorization header set: Token 1655d075...
createPost - Response received: 201
Post created successfully. Response: {id: 1, title: "...", ...}
Tạo bài đăng thành công!
```

---

## 🚨 Các lỗi có thể gặp:

### ❌ Lỗi 1: `Current auth token: NO TOKEN`
**Nguyên nhân:** Token không được lưu khi đăng nhập
**Cách sửa:** 
1. Kiểm tra xem localStorage có `authToken` không?
2. Kiểm tra login response từ API

### ❌ Lỗi 2: `[API] Authorization header: NOT SET`
**Nguyên nhân:** Token không được gửi kèm request
**Cách sửa:**
1. Xóa app cache (Ctrl+Shift+Delete)
2. Hoặc: `localStorage.clear()` trong console

### ❌ Lỗi 3: `Error response status: 401`
**Nguyên nhân:** Token không hợp lệ hoặc hết hạn
**Cách sửa:**
1. Đăng xuất rồi đăng nhập lại
2. Kiểm tra token trong database: `python manage.py shell`

### ❌ Lỗi 4: `Error response status: 400`
**Nguyên nhân:** Dữ liệu không hợp lệ
**Cách sửa:**
- Kiểm tra `Error response data` trong console

---

## 🔧 Kiểm tra Backend:

### Xem có request được nhận không?
```bash
python manage.py shell
from api.models import Post
Post.objects.all().count()  # Xem số posts
Post.objects.latest('id').author  # Xem ai tạo bài mới nhất
```

### Xem requests log:
```bash
tail -f /path/to/django.log
```

---

## ✅ Troubleshooting Steps:

1. **Đăng xuất** → Xóa localStorage → Đăng nhập lại
2. **Mở F12 Console** → Để ý logs
3. **Kiểm tra Network tab** → Request có header `Authorization` không?
4. **Kiểm tra Backend** → Django có nhận request không?

---

## 📋 Cung cấp thông tin gỡ lỗi:

Khi báo cáo lỗi, vui lòng cung cấp:
1. Screenshot Console logs
2. Network tab response body
3. Error message cụ thể
4. Steps để reproduce lỗi
