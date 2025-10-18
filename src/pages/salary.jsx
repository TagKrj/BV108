import React from 'react';

const SalaryPage = () => {
    return (
        <div className="salary-page p-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#2D5016] rounded-lg flex items-center justify-center">
                        <i className="fas fa-truck text-white text-xl"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Kế toán lương</h2>
                        <p className="text-sm text-gray-500">Quản lý kế toán lương</p>
                    </div>
                </div>
                <p className="text-gray-600">
                    Nội dung module Kế toán lương sẽ được phát triển tại đây.
                </p>
            </div>
        </div>
    );
};

export default SalaryPage;
