# Test Delete Post Functionality

## ✅ Các sửa lỗi đã thực hiện:

### 1. **Backend (Django)**
- ✅ Tạo auth tokens cho tất cả users trong database
- ✅ Cấu hình auto-create token cho users mới
- ✅ Thêm custom permission class `IsAuthorOfPost`
- ✅ Cải thiện endpoint `/posts/{id}/can_delete/` với thông tin chi tiết

### 2. **Frontend (React)**
- ✅ Cập nhật `News.js`, `Airdrop.js`, `Testnet.js` với debug logging
- ✅ Hiển thị thông báo lỗi cụ thể từ API
- ✅ Kiểm tra token trước khi gửi request xóa

---

## 🧪 Hướng dẫn test:

### Bước 1: Kiểm tra tokens đã tạo
```bash
python manage.py shell
from rest_framework.authtoken.models import Token
Token.objects.all().values_list('user__username', 'key')
```

### Bước 2: Đăng nhập với tài khoản đã tạo
Ví dụ:
- Email: `thanhnam.fit.iuh@gmail.com`
- Password: (mật khẩu đã tạo)
- Email: `thanhnam21597@gmail.com`
- Password: (mật khẩu đã tạo)

### Bước 3: Kiểm tra Browser Console
Khi bấm xóa bài, bạn sẽ thấy logs:
```
Delete attempt: {postId: 1, currentUser: {...}, hasToken: true}
Permission check result: {can_delete: true, ...}
```

### Bước 4: Xóa bài của chính mình
- Nếu bạn là tác giả → Xóa thành công ✅
- Nếu bạn không phải tác giả → Báo lỗi ❌

---

## 🔧 Nếu vẫn không hoạt động:

### 1. Kiểm tra token được lưu:
```javascript
// Console: 
console.log(localStorage.getItem('authToken'))
```

### 2. Kiểm tra currentUser:
```javascript
// Console:
console.log(localStorage.getItem('authUser'))
```

### 3. Kiểm tra requests trong Network tab:
- Xem header `Authorization: Token <token>`
- Xem response status

---

## 📋 Bảng so sánh trước/sau:

| Trước | Sau |
|-------|-----|
| Xóa bài → Lỗi không rõ | Xóa bài → Báo lỗi cụ thể |
| Không có token cho users mới | Tất cả users có token |
| Kiểm tra permission lỏng lẻo | Permission kiểm tra chặt (custom class) |
| Không log debug | Log chi tiết để diagnose |

---

## ✨ Kịp hạn test hoặc cần thêm fix?
Hãy kiểm tra console log phía trên để xem điều gì đang xảy ra!
