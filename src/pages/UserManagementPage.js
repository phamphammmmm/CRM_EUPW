import React from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Lock, 
  Unlock 
} from 'lucide-react';

// Danh sách vai trò người dùng
const USER_ROLES = {
  ADMIN: 'Quản Trị Viên',
  MANAGER: 'Quản Lý',
  STAFF: 'Nhân Viên',
  VIEWER: 'Người Xem'
};

// Danh sách trạng thái người dùng
const USER_STATUSES = {
  ACTIVE: 'Hoạt Động',
  INACTIVE: 'Ngừng Hoạt Động',
  LOCKED: 'Đã Khóa'
};

// Component Quản Lý Người Dùng
const UserManagementPage = function() {
  // State quản lý
  const [users, setUsers] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');

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

    // Lọc theo trạng thái
    if (filterStatus) {
      result = result.filter(function(user) {
        return user.status === filterStatus;
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
  }, [users, searchTerm, filterRole, filterStatus]);

  // Thêm/Sửa người dùng
  const handleSaveUser = async function(userData) {
    try {
      let response;
      let updatedUser;
      
      if (selectedUser) {
        // Cập nhật người dùng
        response = await fetch('/api/users/' + selectedUser.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        updatedUser = await response.json();
        
        setUsers(function(prev) {
          return prev.map(function(user) {
            return user.id === updatedUser.id ? updatedUser : user;
          });
        });
      } else {
        // Thêm mới người dùng
        response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        updatedUser = await response.json();
        
        setUsers(function(prev) {
          return [...prev, updatedUser];
        });
      }

      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Lỗi lưu người dùng:', error);
    }
  };

  // Khóa/Mở khóa người dùng
  const handleToggleUserStatus = async function(user) {
    try {
      const newStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
      const response = await fetch('/api/users/' + user.id + '/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const updatedUser = await response.json();
      
      setUsers(function(prev) {
        return prev.map(function(u) {
          return u.id === updatedUser.id ? updatedUser : u;
        });
      });
    } catch (error) {
      console.error('Lỗi thay đổi trạng thái người dùng:', error);
    }
  };

  // Render modal thêm/sửa người dùng
  const renderUserModal = function() {
    const initialValues = selectedUser || {
      name: '',
      email: '',
      role: 'STAFF',
      department: '',
      status: 'ACTIVE'
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            {selectedUser ? 'Cập Nhật' : 'Thêm Mới'} Người Dùng
          </h2>
          <form 
            onSubmit={function(e) {
              e.preventDefault();
              const formData = new FormData(e.target);
              const userData = Object.fromEntries(formData.entries());
              handleSaveUser(userData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên Người Dùng
              </label>
              <input 
                name="name" 
                defaultValue={initialValues.name}
                required 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input 
                type="email"
                name="email" 
                defaultValue={initialValues.email}
                required 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phòng Ban
              </label>
              <input 
                name="department" 
                defaultValue={initialValues.department}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vai Trò
              </label>
              <select
                name="role"
                defaultValue={initialValues.role}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                {Object.entries(USER_ROLES).map(function([key, label]) {
                  return (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Trạng Thái
              </label>
              <select
                name="status"
                defaultValue={initialValues.status}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                {Object.entries(USER_STATUSES).map(function([key, label]) {
                  return (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={function() {
                  setIsModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {selectedUser ? 'Cập Nhật' : 'Thêm Mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
          value={filterStatus}
          onChange={function(e) { setFilterStatus(e.target.value); }}
        >
          <option value="">Tất Cả Trạng Thái</option>
          {Object.entries(USER_STATUSES).map(function([key, label]) {
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
            <th className="border p-2">Phòng Ban</th>
            <th className="border p-2">Vai Trò</th>
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
                <td className="border p-2">{user.department}</td>
                <td className="border p-2">
                  {USER_ROLES[user.role] || user.role}
                </td>
                <td className="border p-2">
                  {USER_STATUSES[user.status] || user.status}
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
                      className={
                        user.status === 'ACTIVE' 
                          ? 'text-red-500' 
                          : 'text-green-500'
                      }
                      onClick={function() { 
                        handleToggleUserStatus(user);
                      }}
                    >
                      {user.status === 'ACTIVE' ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                    </button>
                    <button 
                      className="text-red-500"
                      onClick={function() { 
                        // Xóa người dùng
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal thêm/sửa người dùng */}
      {isModalOpen && renderUserModal()}
    </div>
  );
};

export default UserManagementPage;