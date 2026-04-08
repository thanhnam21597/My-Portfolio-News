import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/apiService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const RESET_TOKENS_KEY = "passwordResetTokens";

  const getUsers = () => {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const getResetTokens = () => {
    const raw = localStorage.getItem(RESET_TOKENS_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  };

  const saveResetTokens = (tokens) => {
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
  };

  const saveUser = (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
    setCurrentUser(user);
  };

  const clearUser = () => {
    localStorage.removeItem("authUser");
    setCurrentUser(null);
  };

  const parseAuthError = (error) => {
    const responseData = error?.response?.data;
    if (responseData) {
      if (typeof responseData === 'string') {
        return responseData;
      }
      if (responseData.non_field_errors) {
        return responseData.non_field_errors.join(' ');
      }
      if (responseData.email) {
        return responseData.email.join(' ');
      }
      if (responseData.username) {
        return responseData.username.join(' ');
      }
      if (responseData.password1) {
        return responseData.password1.join(' ');
      }
      if (responseData.password2) {
        return responseData.password2.join(' ');
      }
      return JSON.stringify(responseData);
    }
    return error?.message || 'Có lỗi xảy ra.';
  };

  const login = async (email, password) => {
    try {
      console.log('Login attempt with email:', email);
      const response = await authService.login(email, password);
      console.log('Login response:', response);
      const token = localStorage.getItem('authToken');
      console.log('Token after login:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      const user = { email }; // Lưu thông tin user cơ bản
      saveUser(user);
      console.log('User saved to localStorage:', user);
      console.log('CurrentUser state set to:', user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(parseAuthError(error));
    }
  };

  const signup = async ({ email, username }, password) => {
    try {
      const response = await authService.register(email, username, password, password);
      const user = { email };
      saveUser(user);
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(parseAuthError(error));
    }
  };

  const requestPasswordReset = async (email) => {
    const users = getUsers();
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new Error("Email không tồn tại trong hệ thống.");
    }

    const now = Date.now();
    const token = `${now}-${Math.random().toString(36).slice(2, 12)}`;
    const expiresAt = now + 15 * 60 * 1000;

    const existingTokens = getResetTokens().filter((item) => item.expiresAt > now && item.email !== email);
    const nextTokens = [...existingTokens, { token, email, expiresAt }];
    saveResetTokens(nextTokens);

    return { email, token, expiresAt };
  };

  const resetPassword = async ({ token, oldPassword, newPassword, confirmPassword }) => {
    if (!token) {
      throw new Error("Liên kết đặt lại mật khẩu không hợp lệ.");
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new Error("Vui lòng nhập đầy đủ thông tin.");
    }

    if (newPassword.length < 8) {
      throw new Error("Mật khẩu mới phải có ít nhất 8 ký tự.");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Nhập lại mật khẩu mới không khớp.");
    }

    const now = Date.now();
    const tokens = getResetTokens();
    const tokenData = tokens.find((item) => item.token === token);

    if (!tokenData) {
      throw new Error("Liên kết đặt lại mật khẩu không tồn tại hoặc đã được dùng.");
    }

    if (tokenData.expiresAt < now) {
      saveResetTokens(tokens.filter((item) => item.token !== token));
      throw new Error("Liên kết đặt lại mật khẩu đã hết hạn.");
    }

    const users = getUsers();
    const userIndex = users.findIndex((u) => u.email === tokenData.email);
    if (userIndex === -1) {
      throw new Error("Tài khoản không tồn tại.");
    }

    if (users[userIndex].password !== oldPassword) {
      throw new Error("Mật khẩu cũ không đúng.");
    }

    users[userIndex] = { ...users[userIndex], password: newPassword };
    saveUsers(users);
    saveResetTokens(tokens.filter((item) => item.token !== token));

    return { email: tokenData.email };
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearUser();
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          setCurrentUser({ email: user.email });
        } catch (error) {
          console.error('Error checking auth status:', error);
          localStorage.removeItem("authToken");
          setCurrentUser(null); // Đảm bảo currentUser = null khi token không hợp lệ
        }
      } else {
        setCurrentUser(null); // Đảm bảo currentUser = null khi không có token
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    requestPasswordReset,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

