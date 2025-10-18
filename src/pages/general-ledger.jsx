import React from 'react';

const GeneralLedgerPage = () => {
    return (
        <div className="general-ledger-page p-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#2D5016] rounded-lg flex items-center justify-center">
                        <i className="fas fa-book text-white text-xl"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Kế toán tổng hợp</h2>
                        <p className="text-sm text-gray-500">Quản lý kế toán tổng hợp</p>
                    </div>
                </div>
                <p className="text-gray-600">
                    Nội dung module Kế toán tổng hợp sẽ được phát triển tại đây.
                </p>
            </div>
        </div>
    );
};

export default GeneralLedgerPage;
