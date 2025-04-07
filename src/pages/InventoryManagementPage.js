import React from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Edit, 
  Trash2, 
  ArrowRightLeft 
} from 'lucide-react';

// Danh sách trạng thái sản phẩm
const PRODUCT_STATUSES = {
  IN_STOCK: 'Còn Hàng',
  LOW_STOCK: 'Sắp Hết',
  OUT_OF_STOCK: 'Hết Hàng',
  DISCONTINUED: 'Ngừng Kinh Doanh'
};

// Component Quản Lý Kho
const InventoryManagementPage = function() {
  // State quản lý
  const [products, setProducts] = React.useState([]);
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  
  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');

  // Danh sách kho
  const warehouses = [
    { id: 1, name: 'Kho Trung Tâm' },
    { id: 2, name: 'Kho Phía Nam' },
    { id: 3, name: 'Kho Phía Bắc' }
  ];
  
  // Effect nạp danh sách sản phẩm
  React.useEffect(function() {
    const fetchProducts = async function() {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Lỗi tải danh sách sản phẩm:', error);
      }
    };

    fetchProducts();
  }, []);

  // Lọc và tìm kiếm sản phẩm
  React.useEffect(function() {
    let result = products;

    // Lọc theo trạng thái
    if (filterStatus) {
      result = result.filter(function(p) {
        return p.status === filterStatus;
      });
    }

    // Tìm kiếm
    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      result = result.filter(function(p) {
        return (p.code && p.code.toLowerCase().includes(lowercaseTerm)) ||
               (p.name && p.name.toLowerCase().includes(lowercaseTerm));
      });
    }

    setFilteredProducts(result);
  }, [products, searchTerm, filterStatus]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <Package className="mr-2" /> Quản Lý Kho Hàng
      </h1>
      
      <div className="flex mb-4 space-x-2">
        <div className="relative flex-grow">
          <input 
            placeholder="Tìm kiếm sản phẩm" 
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
          {Object.entries(PRODUCT_STATUSES).map(function([key, label]) {
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
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2" /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Bảng danh sách sản phẩm */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Mã SP</th>
            <th className="border p-2">Tên Sản Phẩm</th>
            <th className="border p-2">Số Lượng</th>
            <th className="border p-2">Đơn Vị</th>
            <th className="border p-2">Trạng Thái</th>
            <th className="border p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(function(product) {
            return (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border p-2">{product.code}</td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.quantity}</td>
                <td className="border p-2">{product.unit}</td>
                <td className="border p-2">
                  {PRODUCT_STATUSES[product.status] || product.status}
                </td>
                <td className="border p-2">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-500"
                      onClick={function() {
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-red-500"
                      onClick={function() { 
                        // Xóa sản phẩm
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-green-500"
                      onClick={function() { 
                        setSelectedProduct(product);
                        setIsTransferModalOpen(true);
                      }}
                    >
                      <ArrowRightLeft className="h-5 w-5" />
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

export default InventoryManagementPage;