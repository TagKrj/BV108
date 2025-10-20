import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAdvancePayment } from '../../hooks/useAccounting';

const AdvanceAccountingPopup = ({ isOpen, onClose, recordData }) => {
    const { createAdvancePayment, loading } = useAdvancePayment();
    // Form states
    const [formData, setFormData] = useState({
        recordCode: recordData?.recordCode || 'HS001',
        advanceType: '',
        amount: 0,
        notes: ''
    });

    // Error states
    const [errors, setErrors] = useState({
        advanceType: false,
        amount: false
    });

    // Preview data (summary)
    const [previewData, setPreviewData] = useState({
        totalAmount: recordData?.totalAmount || 200000,
        advancedAmount: recordData?.advancedAmount || 0,
        isValid: true
    });

    // Update record code when recordData changes
    useEffect(() => {
        if (recordData && recordData.recordCode) {
            setFormData(prev => ({
                ...prev,
                recordCode: recordData.recordCode
            }));
        }
    }, [recordData]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value
        }));

        // Clear errors when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: false
            }));
        }
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {
            advanceType: !formData.advanceType,
            amount: formData.amount <= 0
        };

        setErrors(newErrors);

        // Check if form is valid
        return !Object.values(newErrors).some(error => error);
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            // Chuẩn bị dữ liệu theo format BE
            const advanceData = {
                maBenhNhan: 'BN001', // TODO: Lấy từ recordData hoặc form
                maHoSo: formData.recordCode,
                loaiTamUng: formData.advanceType === 'examination' ? 1 :
                    formData.advanceType === 'treatment' ? 2 :
                        formData.advanceType === 'surgery' ? 2 : 3, // 1: Ngoại trú, 2: Nội trú, 3: Ứng trước
                soTien: parseFloat(formData.amount),
                ghiChu: formData.notes
            };

            await createAdvancePayment(advanceData);

            alert('Tạo phiếu tạm ứng thành công!');
            onClose();
        } catch (error) {
            console.error('Error creating advance payment:', error);
            alert(error.message || 'Không thể tạo phiếu tạm ứng. Vui lòng thử lại!');
        }
    };

    // If popup is not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 60 }}>
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black opacity-70"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-[15px] shadow-xl max-h-[90vh] w-[500px] max-w-[95%] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="bg-gradient-to-br from-[#2D5016] to-[#1A2F0C] px-7 py-5 text-white flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 flex items-center justify-center">
                            <i className="fas fa-hand-holding-dollar text-[#A7D68A]"></i>
                        </div>
                        <h2 className="text-lg font-semibold">Tạm ứng viện phí</h2>
                    </div>
                    <button
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white hover:bg-opacity-20"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                        onClick={onClose}
                    >
                        <i className="fas fa-times text-white text-sm"></i>
                    </button>
                </div>

                {/* Border line */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto">
                    <form className="space-y-6">
                        {/* Mã hồ sơ */}
                        <div className="form-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Mã hồ sơ
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="recordCode"
                                    value={formData.recordCode}
                                    readOnly
                                    className="w-full p-3 bg-[#F9FAFB] border border-gray-200 rounded-lg text-gray-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Loại tạm ứng */}
                        <div className="form-group">
                            <div className="flex items-center mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Loại tạm ứng
                                </label>
                                <span className="text-red-500 font-bold ml-1">*</span>
                            </div>
                            <div className="relative">
                                <select
                                    name="advanceType"
                                    value={formData.advanceType}
                                    onChange={handleChange}
                                    className={`w-full p-3 bg-[#F9FAFB] border ${errors.advanceType ? 'border-red-500' : 'border-gray-200'} rounded-lg text-gray-700 focus:outline-none focus:border-[#2D5016] appearance-none`}
                                >
                                    <option value="">-- Chọn loại tạm ứng --</option>
                                    <option value="1">Ngoại trú</option>
                                    <option value="2">Nội trú</option>
                                    <option value="3">Ứng trước</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                    <i className="fas fa-chevron-down text-gray-500"></i>
                                </div>
                            </div>
                            {errors.advanceType && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">Vui lòng chọn loại tạm ứng</span>
                                </div>
                            )}
                        </div>

                        {/* Số tiền tạm ứng */}
                        <div className="form-group">
                            <div className="flex items-center mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Số tiền tạm ứng
                                </label>
                                <span className="text-red-500 font-bold ml-1">*</span>
                            </div>
                            <div className="relative flex items-center">
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className={`w-full p-3 bg-[#F9FAFB] border ${errors.amount ? 'border-red-500' : 'border-gray-200'} rounded-lg text-gray-700 focus:outline-none focus:border-[#2D5016]`}
                                />
                                <div className="absolute right-3 font-semibold text-gray-500">
                                    VNĐ
                                </div>
                            </div>
                            {errors.amount && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">Số tiền phải lớn hơn 0</span>
                                </div>
                            )}
                        </div>

                        {/* Ghi chú */}
                        <div className="form-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Ghi chú
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-3 bg-[#F9FAFB] border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#2D5016] resize-none"
                            ></textarea>
                        </div>
                    </form>

                    {/* Preview Box */}
                    <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
                            <i className="fas fa-exclamation-triangle text-sm"></i>
                            <span>Số tiền không hợp lệ</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-700">Tổng tiền biên lai:</span>
                                <span className="font-bold text-green-700">
                                    {previewData.totalAmount.toLocaleString()} VNĐ
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-700">Đã tạm ứng:</span>
                                <span className="font-bold text-green-700">
                                    {previewData.advancedAmount.toLocaleString()} VNĐ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-[#F9FAFB] border-t border-gray-200 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check-circle"></i>
                                <span>Xác nhận tạm ứng</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

AdvanceAccountingPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    recordData: PropTypes.shape({
        recordCode: PropTypes.string,
        totalAmount: PropTypes.number,
        advancedAmount: PropTypes.number
    })
};

AdvanceAccountingPopup.defaultProps = {
    recordData: {
        recordCode: 'HS001',
        totalAmount: 200000,
        advancedAmount: 0
    }
};

export default AdvanceAccountingPopup;
