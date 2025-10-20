import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import serviceService from '../services/api/serviceService';

const EditService = ({ service, onClose, onSuccess, serviceGroups }) => {
    const [formData, setFormData] = useState({
        tenDichVu: '',
        maNhomDichVu: '',
        donGia: '',
        donVi: 'VNĐ',
        moTa: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (service) {
            setFormData({
                tenDichVu: service.tenDichVu || '',
                maNhomDichVu: service.maNhomDichVu || '',
                donGia: service.donGia || '',
                donVi: service.donVi || 'VNĐ',
                moTa: service.moTa || ''
            });
        }
    }, [service]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.tenDichVu.trim()) {
            setError('Vui lòng nhập tên dịch vụ');
            return;
        }
        if (!formData.maNhomDichVu) {
            setError('Vui lòng chọn nhóm dịch vụ');
            return;
        }
        if (!formData.donGia || formData.donGia <= 0) {
            setError('Vui lòng nhập đơn giá hợp lệ');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Prepare data with hidden fields
            const dataToSend = {
                tenDichVu: formData.tenDichVu.trim(),
                maNhomDichVu: formData.maNhomDichVu,
                donGia: parseFloat(formData.donGia),
                donVi: formData.donVi.trim(),
                duocBaoHiem: 0,
                tyLeBaoHiem: 0,
                moTa: formData.moTa.trim(),
                trangThai: 1
            };

            await serviceService.updateService(service.maDichVu, dataToSend);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error updating service:', err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật dịch vụ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black opacity-70"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Chỉnh sửa dịch vụ
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Mã dịch vụ (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã dịch vụ
                            </label>
                            <input
                                type="text"
                                value={service?.maDichVu || ''}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Tên dịch vụ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên dịch vụ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="tenDichVu"
                                value={formData.tenDichVu}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                                placeholder="Nhập tên dịch vụ"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Nhóm dịch vụ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nhóm dịch vụ <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="maNhomDichVu"
                                value={formData.maNhomDichVu}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                            >
                                <option value="">-- Chọn nhóm dịch vụ --</option>
                                {serviceGroups.map(group => (
                                    <option key={group.maNhomDichVu} value={group.maNhomDichVu}>
                                        {group.tenNhomDichVu}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Đơn giá */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đơn giá <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="donGia"
                                value={formData.donGia}
                                onChange={handleChange}
                                min="0"
                                step="1000"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                                placeholder="Nhập đơn giá"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Đơn vị */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đơn vị
                            </label>
                            <input
                                type="text"
                                name="donVi"
                                value={formData.donVi}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                                placeholder="Nhập đơn vị"
                            />
                        </div>
                    </div>

                    {/* Mô tả */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả
                        </label>
                        <textarea
                            name="moTa"
                            value={formData.moTa}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent resize-none"
                            placeholder="Nhập mô tả"
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-[#2D5016] to-[#4A7C23] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Đang cập nhật...
                                </>
                            ) : (
                                'Cập nhật'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditService.propTypes = {
    service: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    serviceGroups: PropTypes.array.isRequired
};

export default EditService;
