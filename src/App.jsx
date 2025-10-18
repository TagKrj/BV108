import React, { useState, useEffect } from 'react';
import Sidebar from './layouts/sidebar-new';
import Header from './layouts/header.jsx';
import { menuItems } from './constants/sideBar';
import AppRoutes from './routes/routesPages.jsx';
import { BrowserRouter, useLocation, useNavigate, Navigate, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import './App.css';

// Tách AppContent để có thể sử dụng các hook của React Router
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State để quản lý active menu item (null = Dashboard)
  const [activeMenuItem, setActiveMenuItem] = useState(null); // Default: Dashboard

  // Đồng bộ activeMenuItem với đường dẫn URL hiện tại
  useEffect(() => {
    // Tìm menu item dựa trên đường dẫn hiện tại
    const currentPath = location.pathname;

    // Chuyển hướng về trang kế toán viện phí nếu ở trang gốc
    if (currentPath === '/') {
      navigate('/accounting');
      return;
    }

    const foundItem = menuItems.find(item => item.path === currentPath);

    if (foundItem) {
      setActiveMenuItem(foundItem.id);
    } else {
      // Mặc định chọn menu Kế toán viện phí (id: 4)
      setActiveMenuItem(4);
    }
  }, [location.pathname, navigate]);

  // Tạo breadcrumb items dựa trên active menu
  const getBreadcrumbItems = () => {
    const activeItem = menuItems.find(item => item.id === activeMenuItem);

    if (!activeItem) {
      return [{ label: 'Dashboard', path: '/', active: true }];
    }

    return [
      { label: 'Dashboard', path: '/' },
      { label: activeItem.label, path: activeItem.path, active: true }
    ];
  };

  // Handle breadcrumb click (navigate to Dashboard)
  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  // Get active menu item details
  const activeItem = menuItems.find(item => item.id === activeMenuItem);

  // Handle navigation from AppRoutes
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="app flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeItem={activeMenuItem}
        onMenuClick={setActiveMenuItem}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header with dynamic breadcrumb */}
        <Header
          breadcrumbItems={getBreadcrumbItems()}
          onBreadcrumbClick={handleBreadcrumbClick}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAF9]">
          <div className="container mx-auto p-8">
            {/* Header for pages */}
            {activeItem && (
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {activeItem.label}
                </h1>
                <p className="text-gray-600">
                  Quản lý {activeItem.label.toLowerCase()} - Hệ thống tài chính
                </p>
              </div>
            )}

            {/* Page component always rendered */}
            <div className="p-6">
              <AppRoutes onNavigate={handleNavigate} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main App component
// ProtectedRoute đã được thay thế bằng AuthGuard ở trên

// Root-level auth guard component
const AuthGuard = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const checkLoginState = () => {
      const user = localStorage.getItem('bv108_user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setIsLoggedIn(!!userData.isLoggedIn);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoggedIn(false);
        }
      } else {
        console.log('No user logged in');
        setIsLoggedIn(false);
      }
      setIsChecking(false);
    };

    checkLoginState();

    // Lắng nghe sự kiện storage
    const handleStorageChange = (e) => {
      if (e.key === 'bv108_user' || e.key === null) {
        checkLoginState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isChecking) {
    return <div className="loading">Đang tải...</div>;
  }

  // Nếu đang ở trang login và đã đăng nhập, chuyển về trang kế toán viện phí
  if (location.pathname === '/login' && isLoggedIn) {
    return <Navigate to="/accounting" replace />;
  }

  // Nếu không phải trang login và chưa đăng nhập, chuyển về trang login
  if (location.pathname !== '/login' && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Ngược lại, hiển thị nội dung bình thường
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  );
}

export default App;
