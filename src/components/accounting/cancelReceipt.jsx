import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CancelReceiptPopup = ({ isOpen, onClose, receiptData, onConfirm, loading }) => {
    // Handle form submission
    const handleSubmit = () => {
        onConfirm(receiptData.id, ''); // Gửi lý do rỗng
    };

    // Reset form when closing
    const handleClose = () => {
        onClose();
    };

    // If popup is not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 70 }}>
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black opacity-70"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-[15px] shadow-xl max-h-[90vh] w-[500px] max-w-[95%] overflow-hidden flex flex-col border-2 border-red-300">
                {/* Modal Header */}
                <div className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C] px-7 py-5 text-white flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 flex items-center justify-center">
                            <i className="fas fa-times-circle text-[#FEE2E2]"></i>
                        </div>
                        <h2 className="text-lg font-semibold">Xác nhận hủy biên lai</h2>
                    </div>
                    <button
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white hover:bg-opacity-20"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                        onClick={handleClose}
                    >
                        <i className="fas fa-times text-white text-sm"></i>
                    </button>
                </div>

                {/* Border line */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto">
                    {/* Warning Box */}
                    <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-600 font-bold mb-3">
                            <i className="fas fa-exclamation-triangle text-lg"></i>
                            <span>Cảnh báo</span>
                        </div>
                        <p className="text-sm text-gray-700">
                            Bạn đang thực hiện hủy biên lai <span className="font-bold text-red-600">{receiptData?.code}</span>.
                            Hành động này không thể hoàn tác.
                        </p>
                    </div>

                    {/* Receipt Info */}
                    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin biên lai</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Mã biên lai:</span>
                                <span className="font-bold text-gray-800">{receiptData?.code}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Mã hồ sơ:</span>
                                <span className="font-bold text-gray-800">{receiptData?.recordCode}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tổng tiền:</span>
                                <span className="font-bold text-green-600">
                                    {receiptData?.totalAmount?.toLocaleString() || 0} VNĐ
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Message */}
                    <div className="text-center py-4">
                        <p className="text-base text-gray-700 font-medium">
                            Bạn có chắc chắn muốn hủy biên lai này không?
                        </p>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-[#F9FAFB] border-t border-gray-200 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-times-circle"></i>
                                <span>Xác nhận hủy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

CancelReceiptPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    receiptData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        code: PropTypes.string,
        recordCode: PropTypes.string,
        totalAmount: PropTypes.number
    }),
    onConfirm: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

CancelReceiptPopup.defaultProps = {
    receiptData: null,
    loading: false
};

export default CancelReceiptPopup;
