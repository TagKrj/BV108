import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PayAccountingPopup = ({ isOpen, onClose, recordData }) => {
    // Form states
    const [formData, setFormData] = useState({
        recordCode: recordData?.recordCode || 'HS001',
        discount: 0,
        discountReason: '',
        notes: ''
    });

    // Error states
    const [errors, setErrors] = useState({
        discount: false
    });

    // Summary data
    const [summaryData, setPreviewData] = useState({
        totalAmount: recordData?.totalAmount || 200000,
        advancedAmount: recordData?.advancedAmount || 150000,
        remainingAmount: 0
    });

    // Calculate remaining amount
    useEffect(() => {
        if (recordData) {
            const total = recordData.totalAmount || 0;
            const advanced = recordData.advancedAmount || 0;
            const discount = formData.discount || 0;

            setPreviewData(prev => ({
                ...prev,
                totalAmount: total,
                advancedAmount: advanced,
                remainingAmount: total - advanced - discount
            }));
        }
    }, [recordData, formData.discount]);

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
            [name]: name === 'discount' ? parseFloat(value) || 0 : value
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
            discount: formData.discount < 0
        };

        setErrors(newErrors);

        // Check if form is valid
        return !Object.values(newErrors).some(error => error);
    };

    // Handle form submission
    const handleSubmit = () => {
        if (validateForm()) {
            console.log('Thanh toán ra viện submitted:', formData);
            onClose();
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
            <div className="relative bg-white rounded-[15px] shadow-xl max-h-[90vh] w-[500px] max-w-[95%] overflow-hidden flex flex-col border-2 border-orange-300">
                {/* Modal Header */}
                <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] px-7 py-5 text-white flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 flex items-center justify-center">
                            <i className="fas fa-check-circle text-[#FEF3C7]"></i>
                        </div>
                        <h2 className="text-lg font-semibold">Xác nhận thanh toán ra viện</h2>
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
                    {/* Summary Box */}
                    <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-700 font-bold mb-4">
                            <i className="fas fa-receipt text-sm"></i>
                            <span>Tóm tắt thanh toán</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-sm text-gray-700">Tổng tiền</span>
                                <span className="font-bold text-gray-700">
                                    {summaryData.totalAmount.toLocaleString()} VNĐ
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-sm text-gray-700">Tạm ứng</span>
                                <span className="font-bold text-green-600">
                                    - {summaryData.advancedAmount.toLocaleString()} VNĐ
                                </span>
                            </div>
                            {formData.discount > 0 && (
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-sm text-gray-700">Miễn giảm</span>
                                    <span className="font-bold text-green-600">
                                        - {formData.discount.toLocaleString()} VNĐ
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between pt-1">
                                <span className="font-bold text-gray-700">Còn lại</span>
                                <span className="font-bold text-orange-600">
                                    {summaryData.remainingAmount.toLocaleString()} VNĐ
                                </span>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-6">
                        {/* Số tiền miễn giảm */}
                        <div className="form-group">
                            <div className="flex items-center mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Số tiền miễn giảm
                                </label>
                                <span className="text-red-500 font-bold ml-1">*</span>
                            </div>
                            <div className="relative flex items-center">
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    className={`w-full p-3 bg-[#F9FAFB] border ${errors.discount ? 'border-red-500' : 'border-gray-200'} rounded-lg text-gray-700 focus:outline-none focus:border-[#F59E0B]`}
                                />
                                <div className="absolute right-3 font-semibold text-gray-500">
                                    VNĐ
                                </div>
                            </div>
                            {errors.discount && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">Số tiền phải lớn hơn hoặc bằng 0</span>
                                </div>
                            )}
                        </div>

                        {/* Lý do miễn giảm */}
                        <div className="form-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Lý do miễn giảm
                            </label>
                            <textarea
                                name="discountReason"
                                value={formData.discountReason}
                                onChange={handleChange}
                                rows="2"
                                className="w-full p-3 bg-[#F9FAFB] border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#F59E0B] resize-none"
                                placeholder="Nhập lý do miễn giảm (nếu có)"
                            ></textarea>
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
                                className="w-full p-3 bg-[#F9FAFB] border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#F59E0B] resize-none"
                                placeholder="Nhập ghi chú (nếu có)"
                            ></textarea>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-[#F9FAFB] border-t border-gray-200 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity"
                    >
                        <i className="fas fa-check-circle"></i>
                        <span>Xác nhận thanh toán</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

PayAccountingPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    recordData: PropTypes.shape({
        recordCode: PropTypes.string,
        totalAmount: PropTypes.number,
        advancedAmount: PropTypes.number
    })
};

PayAccountingPopup.defaultProps = {
    recordData: {
        recordCode: 'HS001',
        totalAmount: 200000,
        advancedAmount: 150000
    }
};

export default PayAccountingPopup;
