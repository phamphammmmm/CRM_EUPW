import React from 'react';
import { 
  Mail, 
  ArrowLeft 
} from 'lucide-react';

// Component Quên Mật Khẩu
const ForgotPasswordPage = function() {
  // State quản lý form quên mật khẩu
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageType, setMessageType] = React.useState('');

  // Xử lý yêu cầu đặt lại mật khẩu
  const handleResetPassword = async function(e) {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    setMessageType('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Đã gửi hướng dẫn đặt lại mật khẩu');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      setMessageType('error');
      console.error('Lỗi quên mật khẩu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quên Mật Khẩu
          </h1>
          <p className="text-gray-600 mt-2">
            Nhập email để đặt lại mật khẩu
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Thông báo */}
          {message && (
            <div 
              className={`px-4 py-3 rounded relative ${
                messageType === 'success' 
                  ? 'bg-green-100 border-green-400 text-green-700' 
                  : 'bg-red-100 border-red-400 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* Trường Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="email" 
              placeholder="Nhập email" 
              required
              value={email}
              onChange={function(e) { setEmail(e.target.value); }}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Nút Đặt Lại Mật Khẩu */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md text-white font-semibold 
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isLoading ? 'Đang Gửi...' : 'Đặt Lại Mật Khẩu'}
          </button>

          {/* Quay lại trang đăng nhập */}
          <div className="text-center mt-4">
            <a 
              href="/login" 
              className="text-blue-600 flex items-center justify-center hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang đăng nhập
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;