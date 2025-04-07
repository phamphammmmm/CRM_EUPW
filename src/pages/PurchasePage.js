import React from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Edit, 
  Trash2, 
  Eye 
} from 'lucide-react';

// Danh sách trạng thái đơn mua hàng
const PROCUREMENT_STATUSES = {
  DRAFT: 'Bản Nháp',
  PENDING: 'Chờ Duyệt',
  APPROVED: 'Đã Duyệt',
  PROCESSING: 'Đang Xử Lý',
  COMPLETED: 'Hoàn Thành',
  CANCELLED: 'Đã Hủy'
};

// Component Quản Lý Mua Hàng
const ProcurementManagementPage = function() {
  // State quản lý
  const [procurements, setProcurements] = React.useState([]);
  const [filteredProcurements, setFilteredProcurements] = React.useState([]);
  const [selectedProcurement, setSelectedProcurement] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');
  const [filterSupplier, setFilterSupplier] = React.useState('');

  // Danh sách nhà cung cấp
  const suppliers = [
    { id: 1, name: 'Nhà Cung Cấp A' },
    { id: 2, name: 'Nhà Cung Cấp B' },
    { id: 3, name: 'Nhà Cung Cấp C' }
  ];

  // Effect nạp danh sách đơn mua hàng
  React.useEffect(function() {
    const fetchProcurements = async function() {
      try {
        const response = await fetch('/api/procurements');
        const data = await response.json();
        setProcurements(data);
      } catch (error) {
        console.error('Lỗi tải danh sách mua hàng:', error);
      }
    };

    fetchProcurements();
  }, []);

  // Lọc và tìm kiếm đơn mua hàng
  React.useEffect(function() {
    let result = procurements;

    // Lọc theo trạng thái
    if (filterStatus) {
      result = result.filter(function(procurement) {
        return procurement.status === filterStatus;
      });
    }

    // Lọc theo nhà cung cấp
    if (filterSupplier) {
      result = result.filter(function(procurement) {
        return procurement.supplier.id.toString() === filterSupplier;
      });
    }

    // Tìm kiếm
    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      result = result.filter(function(procurement) {
        return (procurement.code && procurement.code.toLowerCase().includes(lowercaseTerm)) ||
               (procurement.supplier.name && 
                procurement.supplier.name.toLowerCase().includes(lowercaseTerm));
      });
    }

    setFilteredProcurements(result);
  }, [procurements, searchTerm, filterStatus, filterSupplier]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <ShoppingBag className="mr-2" /> Quản Lý Mua Hàng
      </h1>
      
      <div className="flex mb-4 space-x-2">
        <div className="relative flex-grow">
          <input 
            placeholder="Tìm kiếm đơn mua hàng" 
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
          {Object.entries(PROCUREMENT_STATUSES).map(function([key, label]) {
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </select>

        <select 
          className="border rounded px-2"
          value={filterSupplier}
          onChange={function(e) { setFilterSupplier(e.target.value); }}
        >
          <option value="">Tất Cả Nhà Cung Cấp</option>
          {suppliers.map(function(supplier) {
            return (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            );
          })}
        </select>

        <button 
          className="bg-blue-500 text-white rounded px-4 py-2 flex items-center"
          onClick={function() { 
            setSelectedProcurement(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2" /> Tạo Đơn Mua Hàng
        </button>
      </div>

      {/* Bảng danh sách đơn mua hàng */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Mã Đơn</th>
            <th className="border p-2">Nhà Cung Cấp</th>
            <th className="border p-2">Ngày Đặt</th>
            <th className="border p-2">Tổng Tiền</th>
            <th className="border p-2">Trạng Thái</th>
            <th className="border p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredProcurements.map(function(procurement) {
            return (
              <tr key={procurement.id} className="hover:bg-gray-50">
                <td className="border p-2">{procurement.code}</td>
                <td className="border p-2">{procurement.supplier.name}</td>
                <td className="border p-2">
                  {new Date(procurement.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {procurement.totalAmount.toLocaleString()} VND
                </td>
                <td className="border p-2">
                  {PROCUREMENT_STATUSES[procurement.status] || procurement.status}
                </td>
                <td className="border p-2">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-500"
                      onClick={function() {
                        setSelectedProcurement(procurement);
                        setIsModalOpen(true);
                      }}
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-green-500"
                      onClick={function() { 
                        // Chỉnh sửa đơn mua hàng
                      }}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-red-500"
                      onClick={function() { 
                        // Xóa đơn mua hàng
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

export default ProcurementManagementPage;