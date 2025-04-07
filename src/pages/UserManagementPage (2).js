import React from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield 
} from 'lucide-react';

// Danh sách vai trò người dùng
const USER_ROLES = {
  ADMIN: 'Quản Trị Viên',
  MANAGER: 'Quản Lý',
  STAFF: 'Nhân Viên',
  VIEWER: 'Người Xem'
};

// Danh sách phòng ban
const DEPARTMENTS = {
  SALES: 'Kinh Doanh',
  IT: 'Công Nghệ Thông Tin',
  FINANCE: 'Tài Chính',
  HR: 'Nhân Sự',
  LOGISTICS: 'Logistics',
  CUSTOMER_SERVICE: 'Chăm Sóc Khách Hàng'
};

// Component Quản Lý Người Dùng
const UserManagementPage = function() {
  // State quản lý
  const [users, setUsers] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = React.useState(false);
  
  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('');
  const [filterDepartment, setFilterDepartment] = React.useState('');

  // Danh sách quyền hệ thống
  const SYSTEM_PERMISSIONS = [
    { id: 'view_dashboard', name: 'Xem Bảng Điều Khiển' },
    { id: 'manage_customers', name: 'Quản Lý Khách Hàng' },
    { id: 'manage_contracts', name: 'Quản Lý Hợp Đồng' },
    { id: 'manage_inventory', name: 'Quản Lý Kho' },
    { id: 'manage_orders', name: 'Quản Lý Đơn Hàng' },
    { id: 'manage_projects', name: 'Quản Lý Dự Án' },
    { id: 'manage_users', name: 'Quản Lý Người Dùng' }
  ];

  // Effect nạp danh sách người dùng
  React.useEffect(function() {
    const fetchUsers = async function() {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Lỗi tải danh sách người dùng:', error);
      }
    };

    fetchUsers();
  }, []);

  // Lọc và tìm kiếm người dùng
  React.useEffect(function() {
    let result = users;

    // Lọc theo vai trò
    if (filterRole) {
      result = result.filter(function(user) {
        return user.role === filterRole;
      });
    }

    // Lọc theo phòng ban
    if (filterDepartment) {
      result = result.filter(function(user) {
        return user.department === filterDepartment;
      });
    }

    // Tìm kiếm
    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      result = result.filter(function(user) {
        return (user.name && user.name.toLowerCase().includes(lowercaseTerm)) ||
               (user.email && user.email.toLowerCase().includes(lowercaseTerm));
      });
    }

    setFilteredUsers(result);
  }, [users, searchTerm, filterRole, filterDepartment]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <Users className="mr-2" /> Quản Lý Người Dùng
      </h1>
      
      <div className="flex mb-4 space-x-2">
        <div className="relative flex-grow">
          <input 
            placeholder="Tìm kiếm người dùng" 
            className="w-full pl-8 pr-2 py-2 border rounded"
            value={searchTerm}
            onChange={function(e) { setSearchTerm(e.target.value); }}
          />
          <Search className="absolute left-2 top-3 text-gray-400" />
        </div>

        <select 
          className="border rounded px-2"
          value={filterRole}
          onChange={function(e) { setFilterRole(e.target.value); }}
        >
          <option value="">Tất Cả Vai Trò</option>
          {Object.entries(USER_ROLES).map(function([key, label]) {
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </select>

        <select 
          className="border rounded px-2"
          value={filterDepartment}
          onChange={function(e) { setFilterDepartment(e.target.value); }}
        >
          <option value="">Tất Cả Phòng Ban</option>
          {Object.entries(DEPARTMENTS).map(function([key, label]) {
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </select>

        <button 
          className="bg-blue-500 text-white rounded px-4 py-2 flex items-center"
          onClick={function() { 
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2" /> Thêm Người Dùng
        </button>
      </div>

      {/* Bảng danh sách người dùng */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Tên</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Vai Trò</th>
            <th className="border p-2">Phòng Ban</th>
            <th className="border p-2">Trạng Thái</th>
            <th className="border p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(function(user) {
            return (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  {USER_ROLES[user.role] || user.role}
                </td>
                <td className="border p-2">
                  {DEPARTMENTS[user.department] || user.department}
                </td>
                <td className="border p-2">
                  {user.status === 'ACTIVE' ? 'Hoạt Động' : 'Ngừng Hoạt Động'}
                </td>
                <td className="border p-2">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-500"
                      onClick={function() {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-red-500"
                      onClick={function() { 
                        // Xóa người dùng
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-green-500"
                      onClick={function() {
                        setSelectedUser(user);
                        setIsPermissionModalOpen(true);
                      }}
                    >
                      <Shield className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementPage;