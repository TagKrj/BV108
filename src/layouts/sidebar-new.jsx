import React from 'react';
import { menuItems, logoutMenuItem } from '../constants/sideBar';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeItem, onMenuClick }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Hiển thị hộp thoại xác nhận đăng xuất
        const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?');

        if (confirmLogout) {
            // Xóa thông tin người dùng khỏi localStorage
            localStorage.removeItem('bv108_user');

            // Thêm sự kiện storage để thông báo cho các tab khác
            window.dispatchEvent(new Event('storage'));

            // Tải lại trang để chuyển đến màn hình đăng nhập
            window.location.reload();
        }
    };

    return (
        <div className="sidebar w-[280px] h-screen bg-gradient-to-b from-[#2D5016] to-[#1A2F0C] text-white flex flex-col">
            {/* Header Section */}
            <div className="sidebar-header px-6 pt-6 pb-8">
                {/* Logo */}
                <div className="hospital-logo flex justify-center mb-4">
                    <div className="logo-container w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
                        <span className="text-[#2D5016] font-bold text-2xl">108</span>
                    </div>
                </div>

                {/* Hospital Name */}
                <div className="hospital-name text-center mb-2">
                    <h1 className="text-white font-bold text-base">Bệnh viện Quân y 108</h1>
                </div>

                {/* Subtitle */}
                <div className="hospital-subtitle text-center opacity-80">
                    <p className="text-[#A7D68A] text-xs">Hệ thống Quản lý Viện phí</p>
                </div>

                {/* Divider */}
                <div className="divider mt-8 border-t border-white/10"></div>
            </div>

            {/* Navigation Menu */}
            <nav className="nav-menu px-3 flex-1 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <a
                                href={item.path}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onMenuClick(item.id);
                                    navigate(item.path); // Sử dụng React Router để điều hướng
                                }}
                                className={`nav-item flex items-center px-4 py-3 rounded-lg transition-all duration-200 relative group
                  ${activeItem === item.id
                                        ? 'bg-white/15 border-l-[3px] border-[#A7D68A]'
                                        : 'hover:bg-white/5'
                                    }
                `}
                            >

                                {/* Icon */}
                                <div className="icon-wrapper w-4 flex items-center justify-center mr-4">
                                    <i className={`fas ${item.icon} text-white`}></i>
                                </div>

                                {/* Label */}
                                <span className="text-white text-base font-normal">{item.label}</span>

                                {/* Notification Badge */}
                                {item.hasNotification && (
                                    <div className="ml-auto w-2 h-2 bg-[#A7D68A] rounded-full"></div>
                                )}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Logout Section */}
                <div className="mt-auto pb-8 pt-4">
                    <div className="divider mb-4 border-t border-white/10"></div>
                    <ul>
                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLogout();
                                }}
                                className="nav-item flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/5"
                            >
                                {/* Icon */}
                                <div className="icon-wrapper w-4 flex items-center justify-center mr-4">
                                    <i className="fas fa-sign-out-alt text-white"></i>
                                </div>

                                {/* Label */}
                                <span className="text-white text-base font-normal">Đăng xuất</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;