// src/services/authService.js
import api from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Lưu token vào localStorage
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Giải mã token để lấy thông tin người dùng
      return jwt_decode(token);
    }
    return null;
  }
};

export default authService;