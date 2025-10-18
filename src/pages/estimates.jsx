import React, { useState } from 'react';
import DetailEstimate from '../components/detailEstimate';

const EstimatesPage = () => {
    // State for view mode (list or create)
    const [view, setView] = useState('list'); // 'list' or 'create'

    // State for DetailEstimate component
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedEstimate, setSelectedEstimate] = useState(null);

    // Mock data for list view
    const mockEstimates = [
        {
            id: '49f24066-96d9',
            budgetCode: 'Q1/2024',
            item: 'Khoa Nội',
            amount: '5,500,000,000',
            status: 'rejected', // rejected, approved, pending
            executingUnit: 'giamdoc',
            manager: 'truongkhoa_noi',
            createdAt: '07/10/2025',
            startDate: '01/01/2024',
            endDate: '31/03/2024',
            notes: 'Ngân sách cho thiết bị và vật tư y tế năm 2024'
        },
        {
            id: '8a3b5c12-45e6',
            budgetCode: 'Q2/2024',
            item: 'Khoa Ngoại',
            amount: '6,200,000,000',
            status: 'approved',
            executingUnit: 'giamdoc',
            manager: 'truongkhoa_ngoai',
            createdAt: '03/10/2025',
            startDate: '01/04/2024',
            endDate: '30/06/2024',
            notes: 'Bổ sung trang thiết bị mổ mới'
        },
        {
            id: '2f7d8e90-12ab',
            budgetCode: 'Q3/2024',
            item: 'Khoa Sản',
            amount: '4,800,000,000',
            status: 'pending',
            executingUnit: '-',
            manager: 'truongkhoa_san',
            createdAt: '06/10/2025',
            startDate: '01/07/2024',
            endDate: '30/09/2024',
            notes: 'Nâng cấp phòng sinh và chăm sóc sơ sinh'
        }
    ];

    // Form state
    const [formData, setFormData] = useState({
        budgetCode: '',
        item: '',
        itemType: '',
        amount: '',
        notes: '',
        executingUnit: '',
        manager: '',
        startDate: '',
        endDate: ''
    });

    // Error state
    const [errors, setErrors] = useState({});

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Format currency for amount field
        if (name === 'amount') {
            // Remove non-numeric characters
            const numericValue = value.replace(/[^0-9]/g, '');

            // Format with commas for thousands
            const formattedValue = numericValue ?
                new Intl.NumberFormat('vi-VN').format(parseInt(numericValue)) : '';

            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear errors when typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: false
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.budgetCode) newErrors.budgetCode = 'Vui lòng chọn mã ngân sách';
        if (!formData.amount) newErrors.amount = 'Vui lòng nhập số tiền dự toán';
        if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
        if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Process the form data (would typically be an API call)
            console.log('Form submitted:', formData);
            alert('Đã tạo dự toán thành công!');

            // Reset form and return to list view
            setFormData({
                budgetCode: '',
                item: '',
                itemType: '',
                amount: '',
                notes: '',
                executingUnit: '',
                manager: '',
                startDate: '',
                endDate: ''
            });

            setView('list');
        }
    };

    // Get status badge class based on status
    const getStatusBadge = (status) => {
        switch (status) {
            case 'rejected':
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-600',
                    label: 'TỪ CHỐI'
                };
            case 'approved':
                return {
                    bg: 'bg-green-50',
                    text: 'text-green-700',
                    label: 'ĐÃ DUYỆT'
                };
            case 'pending':
                return {
                    bg: 'bg-amber-50',
                    text: 'text-amber-800',
                    label: 'CHỜ DUYỆT'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-600',
                    label: 'CHƯA XÁC ĐỊNH'
                };
        }
    };

    // Handle delete action
    const handleDelete = (id) => {
        console.log('Delete estimate with ID:', id);
        // Would typically make an API call here
        alert(`Đã xóa dự toán với ID: ${id}`);
    };

    // Handle detail view
    const handleViewDetail = (id) => {
        const estimate = mockEstimates.find(est => est.id === id);
        if (estimate) {
            setSelectedEstimate(estimate);
            setIsDetailOpen(true);
        }
    };

    return (
        <div className="estimates-page">
            {/* Detail Estimate Popup */}
            <DetailEstimate
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                estimate={selectedEstimate}
            />

            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-[15px] border border-gray-200 shadow-sm">
                {/* Card Title */}
                <div className="card-title mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className="fas fa-coins text-[#2D5016] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Tạo dự toán mới
                        </h2>
                    </div>
                </div>
                <div className="flex justify-between gap-8">
                    {/* Left Column */}
                    <div className="form-layout w-1/2">
                        {/* Budget Code */}
                        <div className="form-group mb-5">
                            <div className="flex items-center mb-2">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Mã ngân sách
                                </label>
                                <span className="text-red-500 font-bold ml-1">*</span>
                            </div>
                            <div className="relative">
                                <select
                                    name="budgetCode"
                                    value={formData.budgetCode}
                                    onChange={handleChange}
                                    className={`w-full h-[43px] px-4 border ${errors.budgetCode ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white`}
                                >
                                    <option value="">Chọn mã ngân sách</option>
                                    <option value="Q1/2024">Q1/2024</option>
                                    <option value="Q2/2024">Q2/2024</option>
                                    <option value="Q3/2024">Q3/2024</option>
                                    <option value="Q4/2024">Q4/2024</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                        <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            {errors.budgetCode && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">{errors.budgetCode}</span>
                                </div>
                            )}
                        </div>

                        {/* Item */}
                        <div className="form-group mb-5">
                            <div className="flex items-center mb-2">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Hạng mục
                                </label>
                            </div>
                            <div className="relative">
                                <select
                                    name="item"
                                    value={formData.item}
                                    onChange={handleChange}
                                    className={`w-full h-[43px] px-4 border ${errors.item ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white`}
                                >
                                    <option value="">Chọn hạng mục</option>
                                    <option value="Khoa Nội">Khoa Nội</option>
                                    <option value="Khoa Ngoại">Khoa Ngoại</option>
                                    <option value="Khoa Sản">Khoa Sản</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                        <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            {errors.item && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">{errors.item}</span>
                                </div>
                            )}
                        </div>

                        {/* Item Type */}
                        <div className="form-group mb-5">
                            <div className="flex items-center mb-2">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Loại hạng mục
                                </label>
                            </div>
                            <div className="relative">
                                <select
                                    name="itemType"
                                    value={formData.itemType}
                                    onChange={handleChange}
                                    className={`w-full h-[43px] px-4 border ${errors.itemType ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white`}
                                >
                                    <option value="">Chọn loại hạng mục</option>
                                    <option value="Trang thiết bị">Trang thiết bị</option>
                                    <option value="Vật tư y tế">Vật tư y tế</option>
                                    <option value="Thuốc">Thuốc</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                        <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            {errors.itemType && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">{errors.itemType}</span>
                                </div>
                            )}
                        </div>

                        {/* Manager */}
                        <div className="form-group">
                            <div className="flex items-center mb-2">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Người phụ trách
                                </label>
                            </div>
                            <div className="relative">
                                <select
                                    name="manager"
                                    value={formData.manager}
                                    onChange={handleChange}
                                    className={`w-full h-[43px] px-4 border ${errors.manager ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white`}
                                >
                                    <option value="">Chọn người phụ trách</option>
                                    <option value="giamdoc">Giám đốc</option>
                                    <option value="truongphong">Trưởng phòng</option>
                                    <option value="truongkhoa">Trưởng khoa</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                        <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            {errors.manager && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">{errors.manager}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="form-layout w-1/2">
                        {/* Amount */}
                        <div className="form-group mb-5">
                            <div className="flex items-center mb-2">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Số tiền dự toán
                                </label>
                                <span className="text-red-500 font-bold ml-1">*</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className={`w-full h-[43px] px-4 border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent`}
                                    placeholder="Nhập số tiền dự toán"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                                    VNĐ
                                </div>
                            </div>
                            {errors.amount && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">{errors.amount}</span>
                                </div>
                            )}
                        </div>

                        {/* Executing Unit */}
                        <div className="form-group mb-5">
                            <div className="flex items-center mb-2">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Đơn vị thực hiện
                                </label>
                            </div>
                            <div className="relative">
                                <select
                                    name="executingUnit"
                                    value={formData.executingUnit}
                                    onChange={handleChange}
                                    className={`w-full h-[43px] px-4 border ${errors.executingUnit ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white`}
                                >
                                    <option value="">Chọn đơn vị thực hiện</option>
                                    <option value="giamdoc">Giám đốc</option>
                                    <option value="phongTaiChinh">Phòng Tài chính</option>
                                    <option value="phongKeHoach">Phòng Kế hoạch</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                        <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            {errors.executingUnit && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">{errors.executingUnit}</span>
                                </div>
                            )}
                        </div>

                        {/* Start Date */}
                        <div className="form-group mb-5">
                            <div className="flex items-center mb-2">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Ngày bắt đầu
                                </label>
                                <span className="text-red-500 font-bold ml-1">*</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className={`w-full h-[43px] px-4 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent`}
                                />
                            </div>
                            {errors.startDate && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">{errors.startDate}</span>
                                </div>
                            )}
                        </div>

                        {/* End Date */}
                        <div className="form-group">
                            <div className="flex items-center mb-0">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Ngày kết thúc
                                </label>
                                <span className="text-red-500 font-bold ml-1">*</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className={`w-full h-[43px] px-4 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent`}
                                />
                            </div>
                            {errors.endDate && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">{errors.endDate}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notes - Full width */}
                <div className="mt-5">
                    <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent resize-none"
                        placeholder="Nhập ghi chú..."
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div className="submit-section flex justify-center mt-5">
                    <button
                        type="submit"
                        className="px-5 py-3 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white font-bold rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                        <i className="fas fa-plus-circle"></i>
                        <span>Tạo dự toán</span>
                    </button>
                </div>
            </form>

            <div className="list-card bg-white rounded-[15px] border border-gray-200 shadow-sm mt-8">
                {/* Card Header */}
                <div className="list-header flex items-center justify-between px-8 py-6 border-b border-gray-100">
                    <div className="card-title flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className="fas fa-list text-[#2D5016] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Danh sách dự toán
                        </h2>
                    </div>
                    <div className="search-section">
                        <div className="search-input relative">
                            <input
                                type="text"
                                className="w-[400px] h-[42px] pl-12 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                placeholder="Tìm kiếm dự toán..."
                            />
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="data-table overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Mã dự toán
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Mã ngân sách
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Hạng mục
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Số tiền dự toán
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Trạng thái
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Đơn vị thực hiện
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Chi tiết
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Xóa
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {mockEstimates.map((estimate) => {
                                const statusBadge = getStatusBadge(estimate.status);

                                return (
                                    <tr key={estimate.id} className="border-t border-gray-100">
                                        <td className="px-4 py-4">
                                            <div className="bg-gray-100 rounded-md px-2 py-1.5">
                                                <span className="text-xs text-[#2D5016] font-normal">
                                                    {estimate.id}...
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="bg-blue-50 text-blue-700 rounded-md px-2 py-1 inline-block">
                                                <span className="text-xs font-semibold">{estimate.budgetCode}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-800">{estimate.item}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-bold text-gray-800">
                                                {estimate.amount} ₫
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className={`${statusBadge.bg} ${statusBadge.text} rounded-md px-3 py-1 inline-block`}>
                                                <span className="text-xs font-medium">{statusBadge.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-800">
                                                {estimate.executingUnit}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => handleViewDetail(estimate.id)}
                                                className="border border-[#2D5016] rounded-md px-3 py-1.5 text-xs text-[#2D5016]"
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => handleDelete(estimate.id)}
                                                className="bg-red-500 text-white rounded-md p-1.5"
                                            >
                                                <svg width="12" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    );
};

export default EstimatesPage;
