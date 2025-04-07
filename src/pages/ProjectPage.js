import React from 'react';
import { 
  Clipboard, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Edit, 
  Trash2, 
  Eye 
} from 'lucide-react';

// Danh sách trạng thái dự án
const PROJECT_STATUSES = {
  PLANNING: 'Lập Kế Hoạch',
  IN_PROGRESS: 'Đang Thực Hiện',
  ON_HOLD: 'Tạm Dừng',
  COMPLETED: 'Hoàn Thành',
  CANCELLED: 'Đã Hủy'
};

// Component Quản Lý Dự Án
const ProjectManagementPage = function() {
  // State quản lý
  const [projects, setProjects] = React.useState([]);
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');

  // Effect nạp danh sách dự án
  React.useEffect(function() {
    const fetchProjects = async function() {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Lỗi tải danh sách dự án:', error);
      }
    };

    fetchProjects();
  }, []);

  // Lọc và tìm kiếm dự án
  React.useEffect(function() {
    let result = projects;

    // Lọc theo trạng thái
    if (filterStatus) {
      result = result.filter(function(project) {
        return project.status === filterStatus;
      });
    }

    // Tìm kiếm
    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      result = result.filter(function(project) {
        return (project.code && project.code.toLowerCase().includes(lowercaseTerm)) ||
               (project.name && project.name.toLowerCase().includes(lowercaseTerm)) ||
               (project.customer && project.customer.name && 
                project.customer.name.toLowerCase().includes(lowercaseTerm));
      });
    }

    setFilteredProjects(result);
  }, [projects, searchTerm, filterStatus]);

  // Xuất Excel
  const handleExportExcel = async function() {
    try {
      const response = await fetch('/api/projects/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchTerm,
          filterStatus
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'danh_sach_du_an.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Lỗi xuất Excel:', error);
    }
  };

  // Render modal chi tiết dự án
  const renderProjectDetailModal = function() {
    if (!selectedProject) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Chi Tiết Dự Án</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Mã Dự Án:</p>
              <p>{selectedProject.code}</p>
            </div>
            <div>
              <p className="font-medium">Tên Dự Án:</p>
              <p>{selectedProject.name}</p>
            </div>
            <div>
              <p className="font-medium">Khách Hàng:</p>
              <p>{selectedProject.customer.name}</p>
            </div>
            <div>
              <p className="font-medium">Ngày Bắt Đầu:</p>
              <p>{new Date(selectedProject.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Ngày Kết Thúc Dự Kiến:</p>
              <p>{new Date(selectedProject.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Trạng Thái:</p>
              <p>{PROJECT_STATUSES[selectedProject.status]}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Mô Tả Dự Án</h3>
          <p>{selectedProject.description}</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Thành Viên Dự Án</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Tên</th>
                <th className="border p-2">Vai Trò</th>
                <th className="border p-2">Phòng Ban</th>
              </tr>
            </thead>
            <tbody>
              {selectedProject.team.map(function(member) {
                return (
                  <tr key={member.id}>
                    <td className="border p-2">{member.name}</td>
                    <td className="border p-2">{member.role}</td>
                    <td className="border p-2">{member.department}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={function() { 
                setSelectedProject(null); 
                setIsModalOpen(false); 
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <Clipboard className="mr-2" /> Quản Lý Dự Án
      </h1>
      
      <div className="flex mb-4 space-x-2">
        <div className="relative flex-grow">
          <input 
            placeholder="Tìm kiếm dự án" 
            className="w-full pl-8 pr-2 py-2 border rounded"
            value={searchTerm}
            onChange={function(e) { setSearchTerm(e.target.value); }}
          />
          <Search className="absolute left-2 top-3 text-gray-400" />
        </div>

        <select 
          className="border rounded px-2"
          value={filterStatus}
          onChange={function(e) { setFilterStatus(e.target.value); }}
        >
          <option value="">Tất Cả Trạng Thái</option>
          {Object.entries(PROJECT_STATUSES).map(function([key, label]) {
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </select>

        <button 
          className="flex items-center border rounded px-3 py-2"
          onClick={handleExportExcel}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Xuất Excel
        </button>

        <button 
          className="bg-blue-500 text-white rounded px-4 py-2 flex items-center"
          onClick={function() { 
            // Chuyển đến trang tạo dự án mới
            setSelectedProject(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2" /> Tạo Dự Án
        </button>
      </div>

      {/* Bảng danh sách dự án */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Mã Dự Án</th>
            <th className="border p-2">Tên Dự Án</th>
            <th className="border p-2">Khách Hàng</th>
            <th className="border p-2">Ngày Bắt Đầu</th>
            <th className="border p-2">Trạng Thái</th>
            <th className="border p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map(function(project) {
            return (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="border p-2">{project.code}</td>
                <td className="border p-2">{project.name}</td>
                <td className="border p-2">{project.customer.name}</td>
                <td className="border p-2">
                  {new Date(project.startDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {PROJECT_STATUSES[project.status] || project.status}
                </td>
                <td className="border p-2">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-500"
                      onClick={function() {
                        setSelectedProject(project);
                        setIsModalOpen(true);
                      }}
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-green-500"
                      onClick={function() { 
                        // Chỉnh sửa dự án
                      }}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-red-500"
                      onClick={function() { 
                        // Xóa dự án
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

      {/* Modal chi tiết dự án */}
      {isModalOpen && renderProjectDetailModal()}
    </div>
  );
};

export default ProjectManagementPage;