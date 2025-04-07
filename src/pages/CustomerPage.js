import React, { useState, useEffect } from 'react';
import { Plus, Search, FileSpreadsheet, X, Edit, Trash2 } from 'lucide-react';

// Danh sách loại khách hàng
const CUSTOMER_TYPES = {
  INDIVIDUAL: 'Cá Nhân',
  CORPORATE: 'Doanh Nghiệp',
  VIP: 'VIP',
  POTENTIAL: 'Tiềm Năng'
};

// Component Quản Lý Khách Hàng
const CustomerManagementPage = () => {
  // State quản lý
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Effect nạp danh sách khách hàng
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Lỗi tải danh sách khách hàng:', error);
      }
    };

    fetchCustomers();
  }, []);

  // Lọc và tìm kiếm khách hàng
  useEffect(() => {
    let result = customers;

    // Lọc theo loại khách hàng
    if (filterType) {
      result = result.filter(c => c.customerType === filterType);
    }

    // Tìm kiếm
    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.fullName.toLowerCase().includes(lowercaseTerm) ||
        c.email.toLowerCase().includes(lowercaseTerm) ||
        c.phone.toLowerCase().includes(lowercaseTerm)
      );
    }

    setFilteredCustomers(result);
  }, [customers, searchTerm, filterType]);

  // Thêm/Sửa khách hàng
  const handleSaveCustomer = async (customerData) => {
    try {
      let response, updatedCustomer;
      
      if (selectedCustomer) {
        // Cập nhật khách hàng
        response = await fetch(`/api/customers/${selectedCustomer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData)
        });
        updatedCustomer = await response.json();
        
        setCustomers(prev => 
          prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
        );
      } else {
        // Thêm mới khách hàng
        response = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData)
        });
        updatedCustomer = await response.json();
        
        setCustomers(prev => [...prev, updatedCustomer]);
      }

      setIsModalOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Lỗi lưu khách hàng:', error);
    }
  };

  // Xóa khách hàng
  const handleDeleteCustomer = async (customerId) => {
    try {
      await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE'
      });

      setCustomers(prev => prev.filter(c => c.id !== customerId));
    } catch (error) {
      console.error('Lỗi xóa khách hàng:', error);
    }
  };

  // Xuất Excel
  const handleExportExcel = async () => {
    try {
      const response = await fetch('/api/customers/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchTerm,
          filterType
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'danh_sach_khach_hang.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Lỗi xuất Excel:', error);
    }
  };

  // Render form thêm/sửa khách hàng
  const renderCustomerForm = () => {
    const initialValues = selectedCustomer || {
      fullName: '',
      email: '',
      phone: '',
      customerType: 'INDIVIDUAL',
      address: '',
      taxCode: ''
    };

    return (
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const customerData = Object.fromEntries(formData.entries());
          handleSaveCustomer(customerData);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên Khách Hàng
          </label>
          <input 
            name="fullName" 
            defaultValue={initialValues.fullName}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input 
            name="email" 
            type="email"
            defaultValue={initialValues.email}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số Điện Thoại
          </label>
          <input 
            name="phone" 
            defaultValue={initialValues.phone}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loại Khách Hàng
          </label>
          <select
            name="customerType"
            defaultValue={initialValues.customerType}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {Object.entries(CUSTOMER_TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Địa Chỉ
          </label>
          <input 
            name="address" 
            defaultValue={initialValues.address}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mã Số Thuế
          </label>
          <input 
            name="taxCode" 
            defaultValue={initialValues.taxCode}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button 
            type="button" 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={() => {
              setIsModalOpen(false);
              setSelectedCustomer(null);
            }}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {selectedCustomer ? 'Cập Nhật' : 'Thêm Mới'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white shadow rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Quản Lý Khách Hàng</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input 
                placeholder="Tìm kiếm khách hàng"
                className="pl-8 pr-2 py-2 border rounded w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded px-2 py-2"
            >
              <option value="">Loại khách hàng</option>
              {Object.entries(CUSTOMER_TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            {(searchTerm || filterType) && (
              <button 
                className="border rounded px-2 py-2"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('');
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button 
              className="flex items-center border rounded px-3 py-2"
              onClick={handleExportExcel}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Xuất Excel
            </button>

            <button 
              className="flex items-center bg-blue-600 text-white rounded px-3 py-2"
              onClick={() => {
                setSelectedCustomer(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm Khách Hàng
            </button>
          </div>
        </div>

        {/* Bảng danh sách khách hàng */}
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Mã KH</th>
              <th className="p-2 text-left">Tên Khách Hàng</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Số Điện Thoại</th>
              <th className="p-2 text-left">Loại KH</th>
              <th className="p-2 text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{customer.code}</td>
                <td className="p-2">{customer.fullName}</td>
                <td className="p-2">{customer.email}</td>
                <td className="p-2">{customer.phone}</td>
                <td className="p-2">
                  {CUSTOMER_TYPES[customer.customerType] || customer.customerType}
                </td>
                <td className="p-2">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800 flex items-center"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal thêm/sửa khách hàng */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {selectedCustomer ? 'Cập Nhật' : 'Thêm Mới'} Khách Hàng
              </h2>
              {renderCustomerForm()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagementPage;