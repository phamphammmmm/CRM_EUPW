import React from 'react';
import { Plus, Search, FileSpreadsheet, X, Edit, Trash2 } from 'lucide-react';

// Danh sách trạng thái hợp đồng
const CONTRACT_STATUSES = {
  DRAFT: 'Bản Nháp',
  ACTIVE: 'Đang Hiệu Lực',
  EXPIRED: 'Hết Hạn',
  TERMINATED: 'Đã Chấm Dứt'
};

// Component Quản Lý Hợp Đồng
const ContractManagementPage = () => {
  // State quản lý
  const [contracts, setContracts] = React.useState([]);
  const [filteredContracts, setFilteredContracts] = React.useState([]);
  const [selectedContract, setSelectedContract] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');
  
  // Effect nạp danh sách hợp đồng
  React.useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch('/api/contracts');
        const data = await response.json();
        setContracts(data);
      } catch (error) {
        console.error('Lỗi tải danh sách hợp đồng:', error);
      }
    };

    fetchContracts();
  }, []);

  // Lọc và tìm kiếm hợp đồng
  React.useEffect(() => {
    let result = contracts;

    // Lọc theo trạng thái
    if (filterStatus) {
      result = result.filter(function(c) {
        return c.status === filterStatus;
      });
    }

    // Tìm kiếm
    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      result = result.filter(function(c) {
        return (c.code && c.code.toLowerCase().includes(lowercaseTerm)) ||
               (c.title && c.title.toLowerCase().includes(lowercaseTerm)) ||
               (c.customer && c.customer.fullName && 
                c.customer.fullName.toLowerCase().includes(lowercaseTerm));
      });
    }

    setFilteredContracts(result);
  }, [contracts, searchTerm, filterStatus]);

  // Thêm/Sửa hợp đồng
  const handleSaveContract = async function(contractData) {
    try {
      let response;
      let updatedContract;
      
      if (selectedContract) {
        // Cập nhật hợp đồng
        response = await fetch('/api/contracts/' + selectedContract.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contractData)
        });
        updatedContract = await response.json();
        
        setContracts(function(prev) {
          return prev.map(function(c) {
            return c.id === updatedContract.id ? updatedContract : c;
          });
        });
      } else {
        // Thêm mới hợp đồng
        response = await fetch('/api/contracts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contractData)
        });
        updatedContract = await response.json();
        
        setContracts(function(prev) {
          return [...prev, updatedContract];
        });
      }

      setIsModalOpen(false);
      setSelectedContract(null);
    } catch (error) {
      console.error('Lỗi lưu hợp đồng:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản Lý Hợp Đồng</h1>
      
      <div className="flex mb-4 space-x-2">
        <div className="relative flex-grow">
          <input 
            placeholder="Tìm kiếm hợp đồng" 
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
          {Object.entries(CONTRACT_STATUSES).map(function([key, label]) {
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
            setSelectedContract(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2" /> Thêm Hợp Đồng
        </button>
      </div>

      {/* Bảng danh sách hợp đồng */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Mã HĐ</th>
            <th className="border p-2">Tiêu Đề</th>
            <th className="border p-2">Khách Hàng</th>
            <th className="border p-2">Trạng Thái</th>
            <th className="border p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredContracts.map(function(contract) {
            return (
              <tr key={contract.id} className="hover:bg-gray-50">
                <td className="border p-2">{contract.code}</td>
                <td className="border p-2">{contract.title}</td>
                <td className="border p-2">{contract.customer}</td>
                <td className="border p-2">
                  {CONTRACT_STATUSES[contract.status] || contract.status}
                </td>
                <td className="border p-2">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-500"
                      onClick={function() {
                        setSelectedContract(contract);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-red-500"
                      onClick={function() { 
                        // Xóa hợp đồng
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
    </div>
  );
};

export default ContractManagementPage;