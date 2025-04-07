import React from 'react';
import { 
  LogIn, 
  Lock, 
  User, 
  Eye, 
  EyeOff 
} from 'lucide-react';

// Component Đăng Nhập
const LoginPage = function() {
  // State quản lý form đăng nhập
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // Xử lý đăng nhập
  const handleLogin = async function(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Lưu token và chuyển hướng
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      } else {
        // Hiển thị lỗi
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Lỗi đăng nhập:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý quên mật khẩu
  const handleForgotPassword = function() {
    // Chuyển đến trang quên mật khẩu
    window.location.href = '/forgot-password';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Hệ Thống Quản Trị CRM
          </h1>
          <p className="text-gray-600 mt-2">
            Đăng Nhập Tài Khoản
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Thông báo lỗi */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {/* Trường Email */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="email" 
              placeholder="Email" 
              required
              value={email}
              onChange={function(e) { setEmail(e.target.value); }}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Trường Mật Khẩu */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Mật Khẩu" 
              required
              value={password}
              onChange={function(e) { setPassword(e.target.value); }}
              className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={function() { setShowPassword(!showPassword); }}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Nút Quên Mật Khẩu */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Nút Đăng Nhập */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md text-white font-semibold 
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isLoading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        {/* Phần Đăng Ký */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Chưa có tài khoản? 
            <a 
              href="/register" 
              className="text-blue-600 ml-1 hover:underline"
            >
              Đăng Ký
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;