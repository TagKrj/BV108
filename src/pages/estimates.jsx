import React, { useState, useEffect } from 'react';
import DetailEstimate from '../components/detailEstimate';
import EditServiceGroup from '../components/editServiceGroup';
import serviceGroupService from '../services/api/serviceGroupService';

const EstimatesPage = () => {
    // State for view mode (list or create)
    const [view, setView] = useState('list'); // 'list' or 'create'

    // State for DetailEstimate component
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedEstimate, setSelectedEstimate] = useState(null);

    // State for EditServiceGroup component
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedServiceGroup, setSelectedServiceGroup] = useState(null);

    // State for service groups list
    const [serviceGroups, setServiceGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');



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

    // Load service groups on component mount
    useEffect(() => {
        loadServiceGroups();
    }, []);

    // Load service groups from API
    const loadServiceGroups = async () => {
        try {
            setLoading(true);
            const response = await serviceGroupService.getServiceGroups();

            console.log('API Response:', response);

            // Check if response has data in a nested property
            let dataArray = response;
            if (response && response.data) {
                dataArray = response.data;
            }

            // Reverse array to show newest first
            const sortedGroups = Array.isArray(dataArray) ? [...dataArray].reverse() : [];
            console.log('Service Groups to display:', sortedGroups);
            setServiceGroups(sortedGroups);
        } catch (error) {
            console.error('Error loading service groups:', error);
            // Keep empty array if error
            setServiceGroups([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle input change
    const handleChange = (e) => {
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

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.budgetCode) newErrors.budgetCode = 'Vui lòng nhập mã nhóm dịch vụ';
        if (!formData.amount) newErrors.amount = 'Vui lòng nhập tên nhóm dịch vụ';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                setLoading(true);

                // Prepare data for API
                const serviceGroupData = {
                    maNhomDichVu: formData.budgetCode,
                    tenNhomDichVu: formData.amount,
                    moTa: formData.item || '',
                };

                // Call API to create service group
                await serviceGroupService.createServiceGroup(serviceGroupData);

                alert('Đã tạo nhóm dịch vụ thành công!');

                // Reset form
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

                // Reload service groups list
                await loadServiceGroups();

                setView('list');
            } catch (error) {
                console.error('Error creating service group:', error);
                alert(error?.message || 'Có lỗi xảy ra khi tạo nhóm dịch vụ!');
            } finally {
                setLoading(false);
            }
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

    // Filter service groups based on search text
    const filteredServiceGroups = serviceGroups.filter((group) => {
        if (!searchText) return true;

        const searchLower = searchText.toLowerCase();
        return (
            group.maNhomDichVu?.toLowerCase().includes(searchLower) ||
            group.tenNhomDichVu?.toLowerCase().includes(searchLower) ||
            group.moTa?.toLowerCase().includes(searchLower)
        );
    });

    // Handle delete action
    const handleDelete = async (maNhomDichVu) => {
        // Confirm before delete
        if (!window.confirm(`Bạn có chắc chắn muốn xóa nhóm dịch vụ "${maNhomDichVu}"?`)) {
            return;
        }

        try {
            setLoading(true);
            await serviceGroupService.deleteServiceGroup(maNhomDichVu);

            alert('Đã xóa nhóm dịch vụ thành công!');

            // Reload service groups list
            await loadServiceGroups();
        } catch (error) {
            console.error('Error deleting service group:', error);
            alert(error?.message || 'Có lỗi xảy ra khi xóa nhóm dịch vụ!');
        } finally {
            setLoading(false);
        }
    };

    // Handle edit action
    const handleEdit = (serviceGroup) => {
        setSelectedServiceGroup(serviceGroup);
        setIsEditOpen(true);
    };

    // Handle update service group
    const handleUpdateServiceGroup = async (updatedData) => {
        try {
            setLoading(true);

            const { maNhomDichVu, tenNhomDichVu, moTa } = updatedData;

            await serviceGroupService.updateServiceGroup(maNhomDichVu, {
                tenNhomDichVu,
                moTa,
            });

            alert('Đã cập nhật nhóm dịch vụ thành công!');

            // Close popup
            setIsEditOpen(false);
            setSelectedServiceGroup(null);

            // Reload service groups list
            await loadServiceGroups();
        } catch (error) {
            console.error('Error updating service group:', error);
            alert(error?.message || 'Có lỗi xảy ra khi cập nhật nhóm dịch vụ!');
        } finally {
            setLoading(false);
        }
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

            {/* Edit Service Group Popup */}
            <EditServiceGroup
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedServiceGroup(null);
                }}
                serviceGroup={selectedServiceGroup}
                onSuccess={handleUpdateServiceGroup}
            />

            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-[15px] border border-gray-200 shadow-sm">
                {/* Card Title */}
                <div className="card-title mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className="fas fa-coins text-[#2D5016] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Tạo nhóm dịch vụ mới
                        </h2>
                    </div>
                </div>
                <div className="flex justify-between gap-8">
                    {/* Left Column */}
                    <div className="form-layout w-1/2">
                        {/* Service Group Code */}
                        <div className="form-group mb-5">
                            <div className="flex items-center mb-2">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Mã nhóm dịch vụ
                                </label>
                                <span className="text-red-500 font-bold ml-1">*</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="budgetCode"
                                    value={formData.budgetCode}
                                    onChange={handleChange}
                                    className={`w-full h-[43px] px-4 border ${errors.budgetCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent`}
                                    placeholder="Nhập mã nhóm dịch vụ"
                                />
                            </div>
                            {errors.budgetCode && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">{errors.budgetCode}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="form-group mb-5">
                            <div className="flex items-center mb-2">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Mô tả
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="item"
                                    value={formData.item}
                                    onChange={handleChange}
                                    className={`w-full h-[43px] px-4 border ${errors.item ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent`}
                                    placeholder="Nhập mô tả"
                                />
                            </div>
                            {errors.item && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">{errors.item}</span>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="form-layout w-1/2">
                        {/* Service Group Name */}
                        <div className="form-group mb-5">
                            <div className="flex items-center mb-2">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Tên nhóm dịch vụ
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
                                    placeholder="Nhập tên nhóm dịch vụ"
                                />
                            </div>
                            {errors.amount && (
                                <div className="error-message flex items-center mt-1.5 text-red-500">
                                    <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                    <span className="text-xs">{errors.amount}</span>
                                </div>
                            )}
                        </div>

                        {/* Executing Unit */}
                        {/* <div className="form-group mb-5">
                            <div className="flex items-center mb-2">
                                <label className="form-label block text-sm font-medium text-gray-700">
                                    Trạng thái
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
                        </div> */}

                    </div>
                </div>

                {/* Submit Button */}
                <div className="submit-section flex justify-center mt-5">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-3 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white font-bold rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-plus-circle"></i>
                                <span>Tạo nhóm DV</span>
                            </>
                        )}
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
                            Danh sách nhóm dịch vụ
                        </h2>
                    </div>
                    <div className="search-section">
                        <div className="search-input relative">
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-[400px] h-[42px] pl-12 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                placeholder="Tìm kiếm theo mã, tên hoặc mô tả..."
                            />
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            {searchText && (
                                <button
                                    onClick={() => setSearchText('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="data-table overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Mã nhóm DV
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Tên nhóm DV
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Mô tả
                                </th>
                                {/* <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Trạng thái
                                </th> */}
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Sửa
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Xóa
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : filteredServiceGroups.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                        {searchText ? (
                                            <>
                                                <i className="fas fa-search mr-2"></i>
                                                Không tìm thấy kết quả phù hợp với "{searchText}"
                                            </>
                                        ) : (
                                            'Chưa có nhóm dịch vụ nào'
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                filteredServiceGroups.map((serviceGroup) => {
                                    const statusBadge = getStatusBadge(serviceGroup.trangThai || serviceGroup.status);

                                    return (
                                        <tr key={serviceGroup.maNhomDichVu} className="border-t border-gray-100">
                                            <td className="px-4 py-4">
                                                <div className="bg-blue-50 text-blue-700 rounded-md px-2 py-1 inline-block">
                                                    <span className="text-xs font-semibold">{serviceGroup.maNhomDichVu}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-medium text-gray-800">{serviceGroup.tenNhomDichVu}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-gray-600">{serviceGroup.moTa || '-'}</span>
                                            </td>
                                            {/* <td className="px-4 py-4">
                                                <div className={`${statusBadge.bg} ${statusBadge.text} rounded-md px-3 py-1 inline-block`}>
                                                    <span className="text-xs font-medium">{statusBadge.label}</span>
                                                </div>
                                            </td> */}
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => handleEdit(serviceGroup)}
                                                    className="border border-[#2D5016] rounded-md px-3 py-1.5 text-xs text-[#2D5016] hover:bg-[#2D5016] hover:text-white transition-colors"
                                                >
                                                    <i className="fas fa-edit mr-1"></i>
                                                    Sửa
                                                </button>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => handleDelete(serviceGroup.maNhomDichVu)}
                                                    className="bg-red-500 text-white rounded-md p-1.5 hover:bg-red-600 transition-colors"
                                                >
                                                    <svg width="12" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    );
};

export default EstimatesPage;
