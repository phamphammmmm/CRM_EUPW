import React from 'react';
import { 
  Anchor, 
  Search, 
  FileSpreadsheet, 
  Clock, 
  AlertTriangle, 
  Archive 
} from 'lucide-react';

// Danh sách trạng thái hàng hóa tại cảng
const PORT_INVENTORY_STATUSES = {
  IN_TRANSIT: 'Đang Vận Chuyển',
  ARRIVED: 'Đã Đến Cảng',
  CUSTOMS_CLEARANCE: 'Đang Làm Thủ Tục Hải Quan',
  STORAGE: 'Đang Lưu Kho',
  RELEASED: 'Đã Xuất Kho',
  DELAYED: 'Chậm Trễ'
};

// Component Theo Dõi Hàng Hóa Tại Cảng
const PortInventoryPage = function() {
  // State quản lý
  const [portInventories, setPortInventories] = React.useState([]);
  const [filteredInventories, setFilteredInventories] = React.useState([]);
  const [selectedInventory, setSelectedInventory] = React.useState(null);
  
  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');

  // Danh sách cảng
  const ports = [
    { id: 1, name: 'Cảng Quốc Tế Cái Mép' },
    { id: 2, name: 'Cảng Đà Nẵng' },
    { id: 3, name: 'Cảng Hải Phòng' }
  ];

  // Effect nạp danh sách hàng hóa tại cảng
  React.useEffect(function() {
    const fetchPortInventories = async function() {
      try {
        const response = await fetch('/api/port-inventories');
        const data = await response.json();
        setPortInventories(data);
      } catch (error) {
        console.error('Lỗi tải danh sách hàng hóa tại cảng:', error);
      }
    };

    fetchPortInventories();
  }, []);

  // Lọc và tìm kiếm hàng hóa
  React.useEffect(function() {
    let result = portInventories;

    // Lọc theo trạng thái
    if (filterStatus) {
      result = result.filter(function(inventory) {
        return inventory.status === filterStatus;
      });
    }

    // Tìm kiếm
    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      result = result.filter(function(inventory) {
        return (inventory.code && inventory.code.toLowerCase().includes(lowercaseTerm)) ||
               (inventory.product && inventory.product.name && 
                inventory.product.name.toLowerCase().includes(lowercaseTerm));
      });
    }

    setFilteredInventories(result);
  }, [portInventories, searchTerm, filterStatus]);

  // Tính toán số ngày lưu kho
  const calculateStorageDays = function(arrivalDate) {
    const arrival = new Date(arrivalDate);
    const today = new Date();
    const diffTime = Math.abs(today - arrival);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Render modal chi tiết hàng hóa
  const renderInventoryDetailModal = function() {
    if (!selectedInventory) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Chi Tiết Hàng Hóa Tại Cảng</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Mã Lô Hàng:</p>
              <p>{selectedInventory.code}</p>
            </div>
            <div>
              <p className="font-medium">Tên Sản Phẩm:</p>
              <p>{selectedInventory.product.name}</p>
            </div>
            <div>
              <p className="font-medium">Cảng:</p>
              <p>{selectedInventory.port.name}</p>
            </div>
            <div>
              <p className="font-medium">Ngày Đến:</p>
              <p>{new Date(selectedInventory.arrivalDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Số Ngày Lưu Kho:</p>
              <p>{calculateStorageDays(selectedInventory.arrivalDate)} ngày</p>
            </div>
            <div>
              <p className="font-medium">Trạng Thái:</p>
              <p>{PORT_INVENTORY_STATUSES[selectedInventory.status]}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Chi Phí Lưu Kho</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Loại Chi Phí</th>
                <th className="border p-2">Số Tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Phí Lưu Kho Cảng</td>
                <td className="border p-2">
                  {selectedInventory.storageFee.toLocaleString()} VND
                </td>
              </tr>
              <tr>
                <td className="border p-2">Phí Hải Quan</td>
                <td className="border p-2">
                  {selectedInventory.customsFee.toLocaleString()} VND
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold">Tổng Chi Phí</td>
                <td className="border p-2 font-semibold">
                  {(selectedInventory.storageFee + selectedInventory.customsFee).toLocaleString()} VND
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={function() { 
                setSelectedInventory(null); 
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
        <Anchor className="mr-2" /> Theo Dõi Hàng Hóa Tại Cảng
      </h1>
      
      <div className="flex mb-4 space-x-2">
        <div className="relative flex-grow">
          <input 
            placeholder="Tìm kiếm lô hàng" 
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
          {Object.entries(PORT_INVENTORY_STATUSES).map(function([key, label]) {
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </select>

        <button 
          className="flex items-center border rounded px-3 py-2"
          onClick={function() {
            // Xuất báo cáo
            window.open('/api/port-inventories/export', '_blank');
          }}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Xuất Báo Cáo
        </button>
      </div>

      {/* Bảng danh sách hàng hóa */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Mã Lô</th>
            <th className="border p-2">Tên Sản Phẩm</th>
            <th className="border p-2">Cảng</th>
            <th className="border p-2">Ngày Đến</th>
            <th className="border p-2">Ngày Lưu Kho</th>
            <th className="border p-2">Trạng Thái</th>
            <th className="border p-2">Cảnh Báo</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventories.map(function(inventory) {
            // Tính số ngày lưu kho
            const storageDays = calculateStorageDays(inventory.arrivalDate);
            
            // Xác định mức độ cảnh báo
            const getWarningLevel = function() {
              if (inventory.status === 'DELAYED') return 'high';
              if (storageDays > 30) return 'medium';
              return 'low';
            };

            return (
              <tr 
                key={inventory.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={function() {
                  setSelectedInventory(inventory);
                }}
              >
                <td className="border p-2">{inventory.code}</td>
                <td className="border p-2">{inventory.product.name}</td>
                <td className="border p-2">{inventory.port.name}</td>
                <td className="border p-2">
                  {new Date(inventory.arrivalDate).toLocaleDateString()}
                </td>
                <td className="border p-2">{storageDays} ngày</td>
                <td className="border p-2">
                  {PORT_INVENTORY_STATUSES[inventory.status] || inventory.status}
                </td>
                <td className="border p-2">
                  {getWarningLevel() === 'high' && (
                    <AlertTriangle className="text-red-500 h-5 w-5" />
                  )}
                  {getWarningLevel() === 'medium' && (
                    <Clock className="text-yellow-500 h-5 w-5" />
                  )}
                  {getWarningLevel() === 'low' && (
                    <Archive className="text-green-500 h-5 w-5" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal chi tiết */}
      {selectedInventory && renderInventoryDetailModal()}
    </div>
  );
};

export default PortInventoryPage;