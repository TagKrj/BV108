import React, { useState } from 'react';
import DetailBudget from '../components/detailBudget';

const BudgetPage = () => {
    // Form state
    const [formData, setFormData] = useState({
        quarter: '',
        year: '',
        unit: '',
        totalBudget: '',
        notes: ''
    });

    // Error state
    const [errors, setErrors] = useState({});

    // State for DetailBudget component
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);

    // Sample data
    const budgetData = [
        {
            id: '49f24066-96d9',
            quarter: 1,
            year: 2024,
            unit: 'Khoa Nội',
            totalBudget: 5500000000,
            notes: 'Ngân sách cho thiết bị và vật tư y tế năm 2024',
            status: 'rejected',
            createdBy: 'truongkhoa_noi',
            createdAt: '07/10/2025',
            approvedBy: 'giamdoc',
            approvedAt: '07/10/2025'
        },
        {
            id: '8a3b5c12-45e6',
            quarter: 2,
            year: 2024,
            unit: 'Khoa Ngoại',
            totalBudget: 6200000000,
            notes: 'Bổ sung trang thiết bị mổ mới',
            status: 'approved',
            createdBy: 'truongkhoa_ngoai',
            createdAt: '03/10/2025',
            approvedBy: 'giamdoc',
            approvedAt: '05/10/2025'
        },
        {
            id: '2f7d8e90-12ab',
            quarter: 3,
            year: 2024,
            unit: 'Khoa Sản',
            totalBudget: 4800000000,
            notes: 'Nâng cấp phòng sinh và chăm sóc sơ sinh',
            status: 'pending',
            createdBy: 'truongkhoa_san',
            createdAt: '06/10/2025',
            approvedBy: '',
            approvedAt: ''
        }
    ];

    // Handler for opening detail popup
    const handleOpenDetail = (budget) => {
        setSelectedBudget(budget);
        setIsDetailOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors when typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: false
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.quarter) newErrors.quarter = 'Vui lòng chọn Quý';
        if (!formData.year) newErrors.year = 'Vui lòng chọn Năm';
        if (!formData.unit) newErrors.unit = 'Vui lòng chọn Đơn vị';
        if (!formData.totalBudget) newErrors.totalBudget = 'Vui lòng nhập Tổng ngân sách';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form submitted:', formData);
            // TODO: Gửi dữ liệu đến API
            alert('Tạo ngân sách thành công!');
            // Reset form sau khi gửi thành công
            setFormData({
                quarter: '',
                year: '',
                unit: '',
                totalBudget: '',
                notes: ''
            });
        }
    };

    return (
        <div className="budget-page">
            {/* Form Card */}
            <div className="form-card bg-white rounded-[15px] border border-gray-200 shadow-sm mb-8">
                {/* Card Title */}
                <div className="card-title px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className="fas fa-coins text-[#2D5016] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Tạo ngân sách mới
                        </h2>
                    </div>
                </div>

                {/* Form Layout */}
                <form onSubmit={handleSubmit} className="p-8">
                    <div className='flex justify-between gap-8'>
                        <div className="form-layout w-1/2">
                            {/* Form Group 1 - Quý */}
                            <div className="form-group mb-5">
                                <div className="flex items-center mb-2">
                                    <label className="form-label block text-sm font-medium text-gray-700">
                                        Quý
                                    </label>
                                    <span className="text-red-500 font-bold ml-1">*</span>
                                </div>
                                <div className="relative">
                                    <select
                                        name="quarter"
                                        value={formData.quarter}
                                        onChange={handleInputChange}
                                        className={`w-full h-[43px] px-4 border ${errors.quarter ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white`}
                                    >
                                        <option value="">Chọn Quý</option>
                                        <option value="1">Quý 1</option>
                                        <option value="2">Quý 2</option>
                                        <option value="3">Quý 3</option>
                                        <option value="4">Quý 4</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                            <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.quarter && (
                                    <div className="error-message flex items-center mt-1.5 text-red-500">
                                        <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                        <span className="text-xs">{errors.quarter}</span>
                                    </div>
                                )}
                            </div>

                            {/* Form Group 2 - Năm */}
                            <div className="form-group mb-5">
                                <div className="flex items-center mb-2">
                                    <label className="form-label block text-sm font-medium text-gray-700">
                                        Năm
                                    </label>
                                    <span className="text-red-500 font-bold ml-1">*</span>
                                </div>
                                <div className="relative">
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        className={`w-full h-[43px] px-4 border ${errors.year ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white`}
                                    >
                                        <option value="">Chọn Năm</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                        <option value="2027">2027</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                            <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.year && (
                                    <div className="error-message flex items-center mt-1.5 text-red-500">
                                        <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                        <span className="text-xs">{errors.year}</span>
                                    </div>
                                )}
                            </div>

                            {/* Form Group 3 - Đơn vị */}
                            <div className="form-group mb-5">
                                <div className="flex items-center mb-2">
                                    <label className="form-label block text-sm font-medium text-gray-700">
                                        Đơn vị
                                    </label>
                                    <span className="text-red-500 font-bold ml-1">*</span>
                                </div>
                                <div className="relative">
                                    <select
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleInputChange}
                                        className={`w-full h-[43px] px-4 border ${errors.unit ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white`}
                                    >
                                        <option value="">Chọn Đơn vị</option>
                                        <option value="khoa-noi">Khoa Nội</option>
                                        <option value="khoa-ngoai">Khoa Ngoại</option>
                                        <option value="khoa-san">Khoa Sản</option>
                                        <option value="khoa-nhi">Khoa Nhi</option>
                                        <option value="khoa-xetnghiem">Khoa Xét Nghiệm</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                            <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.unit && (
                                    <div className="error-message flex items-center mt-1.5 text-red-500">
                                        <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                        <span className="text-xs">{errors.unit}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-layout w-1/2">
                            {/* Form Group 4 - Tổng ngân sách */}
                            <div className="form-group mb-5">
                                <div className="flex items-center mb-2">
                                    <label className="form-label block text-sm font-medium text-gray-700">
                                        Tổng ngân sách
                                    </label>
                                    <span className="text-red-500 font-bold ml-1">*</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="totalBudget"
                                        value={formData.totalBudget}
                                        onChange={handleInputChange}
                                        className={`w-full h-[43px] px-4 border ${errors.totalBudget ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent`}
                                        placeholder="Nhập tổng ngân sách"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                                        VNĐ
                                    </div>
                                </div>
                                {errors.totalBudget && (
                                    <div className="error-message flex items-center mt-1.5 text-red-500">
                                        <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                        <span className="text-xs">{errors.totalBudget}</span>
                                    </div>
                                )}
                            </div>

                            {/* Form Group 5 - Ghi chú */}
                            <div className="form-group">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Ghi chú
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Nhập ghi chú"
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="submit-section flex justify-center mt-5">
                        <button
                            type="submit"
                            className="px-5 py-3 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white font-bold rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                            <i className="fas fa-plus-circle"></i>
                            <span>Tạo ngân sách</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Danh sách ngân sách */}
            <div className="list-card bg-white rounded-[15px] border border-gray-200 shadow-sm">
                {/* Detail Budget Popup */}
                <DetailBudget
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    budget={selectedBudget}
                />

                {/* Card Header */}
                <div className="list-header flex items-center justify-between px-8 py-6">
                    <div className="card-title flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className="fas fa-list text-[#2D5016] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Danh sách ngân sách
                        </h2>
                    </div>

                    {/* Search Section */}
                    <div className="search-section">
                        <div className="search-input relative">
                            <input
                                type="text"
                                className="w-[400px] h-[42px] pl-12 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                placeholder="Tìm kiếm ngân sách..."
                            />
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="data-table overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Table Header */}
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Mã ngân sách
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Quý/Năm
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Đơn vị
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Tổng ngân sách
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Trạng thái
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Người duyệt
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Ngày duyệt
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Ngày tạo
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Chi tiết
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Xóa
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {/* Row 1 */}
                            <tr className="border-t border-gray-100">
                                <td className="px-4 py-4">
                                    <div className="bg-gray-100 rounded-md px-2 py-1.5">
                                        <span className="text-xs text-[#2D5016] font-normal">49f24066-96d9...</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="bg-blue-50 text-blue-700 rounded-md px-2 py-1 inline-block">
                                        <span className="text-xs font-semibold">Q1/2024</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">Khoa Nội</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm font-bold text-gray-800">5,500,000,000 ₫</span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="bg-red-50 text-red-600 rounded-md px-3 py-1 inline-block">
                                        <span className="text-xs">TỪ CHỐI</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">giamdoc</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">07/10/2025</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">07/10/2025</span>
                                </td>
                                <td className="px-4 py-4">
                                    <button
                                        className="border border-[#2D5016] rounded-md px-3 py-1.5 text-xs text-[#2D5016]"
                                        onClick={() => handleOpenDetail(budgetData[0])}
                                    >
                                        Chi tiết
                                    </button>
                                </td>
                                <td className="px-4 py-4">
                                    <button className="bg-red-500 text-white rounded-md p-1.5">
                                        <svg width="12" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>

                            {/* Row 2 */}
                            <tr className="border-t border-gray-100">
                                <td className="px-4 py-4">
                                    <div className="bg-gray-100 rounded-md px-2 py-1.5">
                                        <span className="text-xs text-[#2D5016] font-normal">8a3b5c12-45e6...</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="bg-blue-50 text-blue-700 rounded-md px-2 py-1 inline-block">
                                        <span className="text-xs font-semibold">Q2/2024</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">Khoa Ngoại</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm font-bold text-gray-800">6,200,000,000 ₫</span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="bg-green-50 text-green-700 rounded-md px-3 py-1 inline-block">
                                        <span className="text-xs">ĐÃ DUYỆT</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">giamdoc</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">05/10/2025</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">03/10/2025</span>
                                </td>
                                <td className="px-4 py-4">
                                    <button
                                        className="border border-[#2D5016] rounded-md px-3 py-1.5 text-xs text-[#2D5016]"
                                        onClick={() => handleOpenDetail(budgetData[1])}
                                    >
                                        Chi tiết
                                    </button>
                                </td>
                                <td className="px-4 py-4">
                                    <button className="bg-red-500 text-white rounded-md p-1.5">
                                        <svg width="12" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>

                            {/* Row 3 */}
                            <tr className="border-t border-gray-100">
                                <td className="px-4 py-4">
                                    <div className="bg-gray-100 rounded-md px-2 py-1.5">
                                        <span className="text-xs text-[#2D5016] font-normal">2f7d8e90-12ab...</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="bg-blue-50 text-blue-700 rounded-md px-2 py-1 inline-block">
                                        <span className="text-xs font-semibold">Q3/2024</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">Khoa Sản</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm font-bold text-gray-800">4,800,000,000 ₫</span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="bg-amber-50 text-amber-800 rounded-md px-3 py-1 inline-block">
                                        <span className="text-xs">CHỜ DUYỆT</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">-</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">-</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-800">06/10/2025</span>
                                </td>
                                <td className="px-4 py-4">
                                    <button
                                        className="border border-[#2D5016] rounded-md px-3 py-1.5 text-xs text-[#2D5016]"
                                        onClick={() => handleOpenDetail(budgetData[2])}
                                    >
                                        Chi tiết
                                    </button>
                                </td>
                                <td className="px-4 py-4">
                                    <button className="bg-red-500 text-white rounded-md p-1.5">
                                        <svg width="12" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BudgetPage;
