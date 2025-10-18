import React from 'react';
import { menuItems } from '../constants/sideBar';

const DashboardPage = ({ onNavigate }) => {
    return (
        <div className="dashboard-page p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Dashboard
                </h1>
                <p className="text-gray-600">
                    Tổng quan hệ thống Quản lý Tài chính
                </p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onNavigate(item.path)}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-[#2D5016] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i className={`fas ${item.icon} text-white text-xl`}></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                {item.label}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click để truy cập module {item.label.toLowerCase()}
                        </p>
                        {item.hasNotification && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                <span>Có cập nhật mới</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
