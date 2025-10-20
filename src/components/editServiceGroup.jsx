import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EditServiceGroup = ({ isOpen, onClose, serviceGroup, onSuccess }) => {
    const [formData, setFormData] = useState({
        tenNhomDichVu: '',
        moTa: '',
    });

    const [errors, setErrors] = useState({});

    // Load service group data when popup opens
    useEffect(() => {
        if (isOpen && serviceGroup) {
            setFormData({
                tenNhomDichVu: serviceGroup.tenNhomDichVu || '',
                moTa: serviceGroup.moTa || '',
            });
            setErrors({});
        }
    }, [isOpen, serviceGroup]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.tenNhomDichVu?.trim()) {
            newErrors.tenNhomDichVu = 'Vui lòng nhập tên nhóm dịch vụ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSuccess({
                ...formData,
                maNhomDichVu: serviceGroup.maNhomDichVu,
                trangThai: 1, // Fixed to 1
            });
        }
    };

    // Handle close
    const handleClose = () => {
        setFormData({
            tenNhomDichVu: '',
            moTa: '',
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black opacity-70"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-[15px] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <i className="fas fa-edit text-xl"></i>
                        <h2 className="text-xl font-semibold">Chỉnh sửa nhóm dịch vụ</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                    {/* Mã nhóm dịch vụ - Read only */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mã nhóm dịch vụ
                        </label>
                        <div className="w-full h-[43px] px-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center">
                            <span className="text-gray-500">{serviceGroup?.maNhomDichVu}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            <i className="fas fa-info-circle mr-1"></i>
                            Mã nhóm dịch vụ không thể thay đổi
                        </p>
                    </div>

                    {/* Tên nhóm dịch vụ */}
                    <div className="mb-5">
                        <div className="flex items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Tên nhóm dịch vụ
                            </label>
                            <span className="text-red-500 font-bold ml-1">*</span>
                        </div>
                        <input
                            type="text"
                            name="tenNhomDichVu"
                            value={formData.tenNhomDichVu}
                            onChange={handleChange}
                            className={`w-full h-[43px] px-4 border ${errors.tenNhomDichVu ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent`}
                            placeholder="Nhập tên nhóm dịch vụ"
                        />
                        {errors.tenNhomDichVu && (
                            <div className="flex items-center mt-1.5 text-red-500">
                                <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                <span className="text-xs">{errors.tenNhomDichVu}</span>
                            </div>
                        )}
                    </div>

                    {/* Mô tả */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả
                        </label>
                        <textarea
                            name="moTa"
                            value={formData.moTa}
                            onChange={handleChange}
                            rows="4"
                            className={`w-full px-4 py-3 border ${errors.moTa ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent resize-none`}
                            placeholder="Nhập mô tả (tùy chọn)"
                        />
                        {errors.moTa && (
                            <div className="flex items-center mt-1.5 text-red-500">
                                <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                <span className="text-xs">{errors.moTa}</span>
                            </div>
                        )}
                    </div>

                    {/* Trạng thái - Fixed to 1 */}
                    {/* <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="w-full h-[43px] px-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                                <span className="text-gray-700">Hoạt động</span>
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-medium">
                                    <i className="fas fa-check-circle mr-1"></i>
                                    ACTIVE
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            <i className="fas fa-info-circle mr-1"></i>
                            Trạng thái mặc định là hoạt động
                        </p>
                    </div> */}

                    {/* Footer Buttons */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            <i className="fas fa-times mr-2"></i>
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
                        >
                            <i className="fas fa-save mr-2"></i>
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditServiceGroup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    serviceGroup: PropTypes.shape({
        maNhomDichVu: PropTypes.string,
        tenNhomDichVu: PropTypes.string,
        moTa: PropTypes.string,
        trangThai: PropTypes.number,
    }),
    onSuccess: PropTypes.func.isRequired,
};

export default EditServiceGroup;
