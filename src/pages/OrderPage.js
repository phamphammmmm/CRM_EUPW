import React from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Edit, 
  Trash2, 
  Eye 
} from 'lucide-react';

// Danh sách trạng thái đơn hàng
const ORDER_STATUSES = {
  PENDING: 'Chờ Xử Lý',
  PROCESSING: 'Đang Xử Lý',
  SHIPPED: 'Đã Giao Hàng',
  DELIVERED: 'Hoàn Thành',
  CANCELLED: 'Đã Hủy'
};

// Component Quản Lý Đơn Hàng
const OrderManagementPage = function() {
  // State quản lý
  const [orders, setOrders] = React.useState([]);
  const [filteredOrders, setFilteredOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');

  // Effect nạp danh sách đơn hàng
  React.useEffect(function() {
    const fetchOrders = async function() {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Lỗi tải danh sách đơn hàng:', error);
      }
    };

    fetchOrders();
  }, []);

  // Lọc và tìm kiếm đơn hàng
  React.useEffect(function() {
    let result = orders;

    // Lọc theo trạng thái
    if (filterStatus) {
      result = result.filter(function(order) {
        return order.status === filterStatus;
      });
    }

    // Tìm kiếm
    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      result = result.filter(function(order) {
        return (order.code && order.code.toLowerCase().includes(lowercaseTerm)) ||
               (order.customer && order.customer.name && 
                order.customer.name.toLowerCase().includes(lowercaseTerm));
      });
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, filterStatus]);

  // Xuất Excel
  const handleExportExcel = async function() {
    try {
      const response = await fetch('/api/orders/export', {
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
      link.setAttribute('download', 'danh_sach_don_hang.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Lỗi xuất Excel:', error);
    }
  };

  // Render modal chi tiết đơn hàng
  const renderOrderDetailModal = function() {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Chi Tiết Đơn Hàng</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Mã Đơn Hàng:</p>
              <p>{selectedOrder.code}</p>
            </div>
            <div>
              <p className="font-medium">Khách Hàng:</p>
              <p>{selectedOrder.customer.name}</p>
            </div>
            <div>
              <p className="font-medium">Ngày Đặt Hàng:</p>
              <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Trạng Thái:</p>
              <p>{ORDER_STATUSES[selectedOrder.status]}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Sản Phẩm Trong Đơn</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Tên Sản Phẩm</th>
                <th className="border p-2">Số Lượng</th>
                <th className="border p-2">Đơn Giá</th>
                <th className="border p-2">Thành Tiền</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.products.map(function(product) {
                return (
                  <tr key={product.id}>
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2">{product.quantity}</td>
                    <td className="border p-2">
                      {product.price.toLocaleString()} VND
                    </td>
                    <td className="border p-2">
                      {(product.quantity * product.price).toLocaleString()} VND
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="border p-2 text-right font-semibold">
                  Tổng Cộng:
                </td>
                <td className="border p-2 font-semibold">
                  {selectedOrder.totalAmount.toLocaleString()} VND
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-end mt-6">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={function() { 
                setSelectedOrder(null); 
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
        <ShoppingCart className="mr-2" /> Quản Lý Đơn Hàng
      </h1>
      
      <div className="flex mb-4 space-x-2">
        <div className="relative flex-grow">
          <input 
            placeholder="Tìm kiếm đơn hàng" 
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
          {Object.entries(ORDER_STATUSES).map(function([key, label]) {
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
            // Chuyển đến trang tạo đơn hàng mới
          }}
        >
          <Plus className="mr-2" /> Tạo Đơn Hàng
        </button>
      </div>

      {/* Bảng danh sách đơn hàng */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Mã Đơn</th>
            <th className="border p-2">Khách Hàng</th>
            <th className="border p-2">Ngày Đặt</th>
            <th className="border p-2">Tổng Tiền</th>
            <th className="border p-2">Trạng Thái</th>
            <th className="border p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(function(order) {
            return (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border p-2">{order.code}</td>
                <td className="border p-2">{order.customer.name}</td>
                <td className="border p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {order.totalAmount.toLocaleString()} VND
                </td>
                <td className="border p-2">
                  {ORDER_STATUSES[order.status] || order.status}
                </td>
                <td className="border p-2">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-500"
                      onClick={function() {
                        setSelectedOrder(order);
                        setIsModalOpen(true);
                      }}
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-green-500"
                      onClick={function() { 
                        // Chỉnh sửa đơn hàng
                      }}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-red-500"
                      onClick={function() { 
                        // Hủy đơn hàng
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

      {/* Modal chi tiết đơn hàng */}
      {isModalOpen && renderOrderDetailModal()}
    </div>
  );
};

export default OrderManagementPage;