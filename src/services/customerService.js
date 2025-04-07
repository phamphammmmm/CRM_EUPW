// src/services/customerService.js
import api from './api';

const customerService = {
  // Lấy danh sách khách hàng
  getCustomers: async (params = {}) => {
    try {
      const response = await api.get('/customers', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết khách hàng
  getCustomerById: async (customerId) => {
    try {
      const response = await api.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo khách hàng mới
  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin khách hàng
  updateCustomer: async (customerId, customerData) => {
    try {
      const response = await api.put(`/customers/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa khách hàng
  deleteCustomer: async (customerId) => {
    try {
      const response = await api.delete(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm khách hàng
  searchCustomers: async (searchTerm) => {
    try {
      const response = await api.get('/customers/search', {
        params: { term: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xuất báo cáo khách hàng
  exportCustomerReport: async (filters) => {
    try {
      const response = await api.get('/customers/export', {
        params: filters,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default customerService;