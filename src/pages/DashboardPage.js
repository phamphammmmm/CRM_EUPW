import React from 'react';
import { 
  BarChart2, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Box, 
  FileText, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

// Component Báo Cáo Tổng Quan
const DashboardPage = function() {
  // State quản lý dữ liệu dashboard
  const [dashboardData, setDashboardData] = React.useState({
    totalRevenue: 0,
    newCustomers: 0,
    pendingOrders: 0,
    inventoryValue: 0,
    revenueComparison: 0,
    topProducts: [],
    recentActivities: []
  });

  // Effect nạp dữ liệu dashboard
  React.useEffect(function() {
    const fetchDashboardData = async function() {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Lỗi tải dữ liệu dashboard:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Component thẻ số liệu
  const MetricCard = function({ icon, title, value, trend }) {
    return (
      <div className="bg-white shadow rounded-lg p-4 flex items-center">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          {icon}
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <div className="flex items-center">
            <h3 className="text-xl font-bold mr-2">{value}</h3>
            {trend !== undefined && (
              <span className={`flex items-center text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Component biểu đồ top sản phẩm
  const TopProductsChart = function() {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Top Sản Phẩm Bán Chạy</h3>
        <div className="space-y-2">
          {dashboardData.topProducts.map(function(product, index) {
            return (
              <div key={product.id} className="flex items-center">
                <div className="w-12 text-right mr-4 text-gray-500">
                  #{index + 1}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span>{product.name}</span>
                    <span>{product.sales} đơn</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(product.sales / dashboardData.topProducts[0].sales) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Component hoạt động gần đây
  const RecentActivitiesCard = function() {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Hoạt Động Gần Đây</h3>
        <div className="space-y-3">
          {dashboardData.recentActivities.map(function(activity) {
            return (
              <div key={activity.id} className="flex items-start">
                <div className="mr-3 mt-1">
                  {activity.type === 'order' && <ShoppingCart className="h-5 w-5 text-blue-500" />}
                  {activity.type === 'customer' && <Users className="h-5 w-5 text-green-500" />}
                  {activity.type === 'contract' && <FileText className="h-5 w-5 text-purple-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <BarChart2 className="mr-2" /> Bảng Điều Khiển
      </h1>

      {/* Lưới số liệu */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard 
          icon={<DollarSign className="h-6 w-6 text-blue-500" />}
          title="Tổng Doanh Thu"
          value={`${dashboardData.totalRevenue.toLocaleString()} VND`}
          trend={5.2}
        />
        <MetricCard 
          icon={<Users className="h-6 w-6 text-green-500" />}
          title="Khách Hàng Mới"
          value={dashboardData.newCustomers}
          trend={12.5}
        />
        <MetricCard 
          icon={<ShoppingCart className="h-6 w-6 text-purple-500" />}
          title="Đơn Hàng Chờ Xử Lý"
          value={dashboardData.pendingOrders}
          trend={-3.1}
        />
        <MetricCard 
          icon={<Box className="h-6 w-6 text-orange-500" />}
          title="Giá Trị Hàng Tồn"
          value={`${dashboardData.inventoryValue.toLocaleString()} VND`}
          trend={1.8}
        />
      </div>

      {/* Nội dung chi tiết */}
      <div className="grid grid-cols-3 gap-4">
        {/* Biểu đồ sản phẩm */}
        <div className="col-span-2">
          <TopProductsChart />
        </div>

        {/* Hoạt động gần đây */}
        <div>
          <RecentActivitiesCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;