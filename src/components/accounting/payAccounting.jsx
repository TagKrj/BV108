import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDischargePayment } from '../../hooks/useAccounting';

const PayAccountingPopup = ({ isOpen, onClose, recordData, onSuccess }) => {
    const { createDischargePayment, loading } = useDischargePayment();
    const [isSubmitting, setIsSubmitting] = useState(false); // Prevent double submit

    // Form states
    const [formData, setFormData] = useState({
        recordCode: recordData?.recordCode || 'HS001',
        advanceCodes: '', // Danh sách mã tạm ứng (ngăn cách bằng dấu phẩy)
        discount: 0, // Số tiền BN phải thanh toán (tienThucTra)
        discountAmount: 0, // Tiền miễn giảm (nếu có)
        discountReason: '', // Lý do miễn giảm
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

    // Update record code and auto-fill payment amount when recordData changes
    useEffect(() => {
        if (recordData) {
            // Tính tổng tất cả tạm ứng từ mảng tamUngs
            const tongTamUng = recordData?.tamUngs?.reduce((sum, tu) => {
                // Chỉ tính các tạm ứng không phải loại hoàn ứng
                if (tu.loaiTamUng === 3 && tu.trangThai === 3) return sum;
                return sum + parseFloat(tu.soTien || 0);
            }, 0) || 0;

            // Tính số tiền BN phải trả thêm
            const tongTien = parseFloat(recordData?.tongTien || 0);
            const tienBaoHiem = parseFloat(recordData?.tienBaoHiem || 0);
            const tongHoanUng = parseFloat(recordData?.tongTienHoanUng || 0);
            const conPhaiTra = tongTien - tienBaoHiem - tongTamUng + tongHoanUng;

            // Số tiền BN phải thanh toán = conPhaiTra nếu > 0, ngược lại = 0
            const soTienPhaiTra = conPhaiTra > 0 ? conPhaiTra : 0;

            setFormData(prev => ({
                ...prev,
                recordCode: recordData.recordCode || prev.recordCode,
                discount: soTienPhaiTra // Auto-fill số tiền phải thanh toán
            }));
        }
        // Reset submitting state when popup opens
        if (isOpen) {
            setIsSubmitting(false);
        }
    }, [recordData, isOpen]);

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
    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Prevent double submission
        if (isSubmitting || loading) {
            console.log('Already submitting, ignoring duplicate click');
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            // Chuẩn bị dữ liệu theo format BE
            const dischargeData = {
                maHoSo: formData.recordCode,
                danhSachTamUng: formData.advanceCodes
                    ? formData.advanceCodes.split(',').map(code => code.trim()).filter(code => code)
                    : [],
                tienThucTra: parseFloat(formData.discount) || 0, // Số tiền BN phải thanh toán (thực trả)
                tienMienGiam: parseFloat(formData.discountAmount) || 0, // Tiền miễn giảm (nếu có)
                lyDoMienGiam: formData.discountReason,
                ghiChu: formData.notes
            };

            await createDischargePayment(dischargeData);

            // Gọi hàm reload dữ liệu từ component cha TRƯỚC KHI đóng popup
            if (onSuccess) {
                await onSuccess();
            }

            alert('Thanh toán ra viện thành công!');
            onClose();
        } catch (error) {
            console.error('Error creating discharge payment:', error);
            alert(error.message || 'Không thể thanh toán ra viện. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
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
                    {/* <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-lg">
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
                    </div> */}

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

                        {/* Danh sách mã tạm ứng */}
                        {/* <div className="form-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Mã tạm ứng (ngăn cách bởi dấu phẩy)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="advanceCodes"
                                    value={formData.advanceCodes}
                                    onChange={handleChange}
                                    placeholder="VD: TU001, TU002, TU003"
                                    className="w-full p-3 bg-[#F9FAFB] border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#F59E0B]"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Nhập các mã tạm ứng cần khấu trừ, ngăn cách bởi dấu phẩy</p>
                        </div> */}

                        {/* Số tiền bệnh nhân phải thanh toán */}
                        <div className="form-group">
                            <div className="flex items-center mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Số tiền bệnh nhân phải thanh toán
                                </label>
                                <span className="text-red-500 font-bold ml-1">*</span>
                            </div>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    name="discount"
                                    value={formData.discount.toLocaleString()}
                                    readOnly
                                    className="w-full p-3 bg-[#F9FAFB] border border-gray-200 rounded-lg text-gray-500 focus:outline-none cursor-not-allowed"
                                />
                                <div className="absolute right-3 font-semibold text-gray-500">
                                    VNĐ
                                </div>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">
                                <i className="fas fa-info-circle mr-1"></i>
                                Tự động điền từ "BN phải trả thêm" hoặc "Đã thanh toán đủ" trong chi tiết biên lai
                            </p>
                        </div>

                        {/* Lý do miễn giảm */}
                        {/* <div className="form-group">
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
                        </div> */}

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
                        disabled={loading || isSubmitting}
                        className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {(loading || isSubmitting) ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check-circle"></i>
                                <span>Xác nhận thanh toán</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

PayAccountingPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    recordData: PropTypes.shape({
        recordCode: PropTypes.string,
        totalAmount: PropTypes.number,
        advancedAmount: PropTypes.number,
        tamUngs: PropTypes.array, // Danh sách tạm ứng
        tongTien: PropTypes.number, // Tổng tiền biên lai
        tienBaoHiem: PropTypes.number, // Tiền bảo hiểm
        tongTienHoanUng: PropTypes.number // Tổng tiền đã hoàn ứng
    })
};

PayAccountingPopup.defaultProps = {
    recordData: {
        recordCode: 'HS001',
        totalAmount: 200000,
        advancedAmount: 150000,
        tamUngs: [],
        tongTien: 0,
        tienBaoHiem: 0,
        tongTienHoanUng: 0
    }
};

export default PayAccountingPopup;
