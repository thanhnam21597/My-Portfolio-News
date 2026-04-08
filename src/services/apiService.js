import axios from 'axios';

// Cấu hình base URL cho API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Tạo axios instance với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, { hasToken: !!token });
    if (token) {
      config.headers.Authorization = `Token ${token}`;
      console.log(`[API] Authorization header set: Token ${token.substring(0, 20)}...`);
    } else {
      console.log(`[API] No token found - request will be anonymous`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service cho Posts
export const postService = {
  // Lấy tất cả posts
  getAllPosts: async () => {
    try {
      const response = await api.get('/posts/');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Lấy post theo ID
  getPostById: async (id) => {
    try {
      const response = await api.get(`/posts/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Tạo post mới
  createPost: async (postData) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('createPost - Token available:', !!token);
      console.log('createPost - Sending request to /posts/');
      const response = await api.post('/posts/', postData);
      console.log('createPost - Response received:', response.status);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.response?.data);
      throw error;
    }
  },

  // Cập nhật post
  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`/posts/${id}/`, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Cập nhật một phần post
  patchPost: async (id, postData) => {
    try {
      const response = await api.patch(`/posts/${id}/`, postData);
      return response.data;
    } catch (error) {
      console.error('Error patching post:', error);
      throw error;
    }
  },

  // Xóa post
  deletePost: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },
};

// API service cho Authentication
export const authService = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login/', {
        email,
        password,
      });
      const { key } = response.data;
      localStorage.setItem('authToken', key);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Đăng ký
  register: async (email, username, password1, password2) => {
    try {
      const response = await api.post('/auth/registration/', {
        email,
        username,
        password1,
        password2,
      });
      const { key } = response.data;
      localStorage.setItem('authToken', key);
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      await api.post('/auth/logout/');
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error logging out:', error);
      // Vẫn xóa token local dù API call fail
      localStorage.removeItem('authToken');
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user/');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },
};

export default api;