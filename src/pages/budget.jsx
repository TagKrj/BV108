import React, { useState, useEffect } from 'react';
import DetailBudget from '../components/detailBudget';
import EditService from '../components/editService';
import serviceService from '../services/api/serviceService';
import serviceGroupService from '../services/api/serviceGroupService';

const BudgetPage = () => {
    // Form state
    const [formData, setFormData] = useState({
        maDichVu: '',
        tenDichVu: '',
        maNhomDichVu: '',
        donGia: '',
        donVi: 'VNĐ',
        moTa: ''
    });

    // Error state
    const [errors, setErrors] = useState({});

    // State for DetailBudget component
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);

    // State for EditService component
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // State for service groups dropdown
    const [serviceGroups, setServiceGroups] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Load service groups and services on mount
    useEffect(() => {
        loadServiceGroups();
        loadServices();
    }, []);

    // Load service groups from API
    const loadServiceGroups = async () => {
        try {
            const response = await serviceGroupService.getServiceGroups();
            console.log('Service Groups Response:', response);

            let dataArray = response;
            if (response && response.data) {
                dataArray = response.data;
            }

            setServiceGroups(Array.isArray(dataArray) ? dataArray : []);
        } catch (error) {
            console.error('Error loading service groups:', error);
            setServiceGroups([]);
        }
    };

    // Load services from API
    const loadServices = async () => {
        try {
            setLoading(true);
            const response = await serviceService.getServices();
            console.log('Services Response:', response);

            let dataArray = response;
            if (response && response.data) {
                dataArray = response.data;
            }

            // Reverse to show newest first
            const sortedServices = Array.isArray(dataArray) ? [...dataArray].reverse() : [];
            setServices(sortedServices);
        } catch (error) {
            console.error('Error loading services:', error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

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

    // Filter services based on search text
    const filteredServices = services.filter((service) => {
        if (!searchText) return true;

        const searchLower = searchText.toLowerCase();
        return (
            service.maDichVu?.toLowerCase().includes(searchLower) ||
            service.tenDichVu?.toLowerCase().includes(searchLower) ||
            service.maNhomDichVu?.toLowerCase().includes(searchLower) ||
            service.moTa?.toLowerCase().includes(searchLower)
        );
    });

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
        if (!formData.maDichVu) newErrors.maDichVu = 'Vui lòng nhập mã dịch vụ';
        if (!formData.tenDichVu) newErrors.tenDichVu = 'Vui lòng nhập tên dịch vụ';
        if (!formData.maNhomDichVu) newErrors.maNhomDichVu = 'Vui lòng chọn nhóm dịch vụ';
        if (!formData.donGia) newErrors.donGia = 'Vui lòng nhập đơn giá';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                setLoading(true);

                // Prepare data for API
                const serviceData = {
                    maDichVu: formData.maDichVu,
                    tenDichVu: formData.tenDichVu,
                    maNhomDichVu: formData.maNhomDichVu,
                    donGia: parseFloat(formData.donGia),
                    donVi: formData.donVi,
                    moTa: formData.moTa || '',
                };

                // Call API to create service
                await serviceService.createService(serviceData);

                alert('Đã tạo dịch vụ thành công!');

                // Reset form
                setFormData({
                    maDichVu: '',
                    tenDichVu: '',
                    maNhomDichVu: '',
                    donGia: '',
                    donVi: 'VNĐ',
                    moTa: ''
                });

                // Reload services list
                await loadServices();
            } catch (error) {
                console.error('Error creating service:', error);
                alert(error?.message || 'Có lỗi xảy ra khi tạo dịch vụ!');
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle edit service
    const handleEdit = (service) => {
        setSelectedService(service);
        setIsEditOpen(true);
    };

    // Handle close edit popup
    const handleCloseEdit = () => {
        setIsEditOpen(false);
        setSelectedService(null);
    };

    // Handle edit success
    const handleEditSuccess = async () => {
        await loadServices();
    };

    // Handle delete service
    const handleDelete = async (maDichVu) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
            try {
                setLoading(true);
                await serviceService.deleteService(maDichVu);
                alert('Xóa dịch vụ thành công!');
                await loadServices();
            } catch (error) {
                console.error('Error deleting service:', error);
                alert(error?.message || 'Có lỗi xảy ra khi xóa dịch vụ!');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
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
                                Tạo dịch vụ mới
                            </h2>
                        </div>
                    </div>

                    {/* Form Layout */}
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className='flex justify-between gap-8'>
                            <div className="form-layout w-1/2">
                                {/* Form Group 1 - Mã dịch vụ */}
                                <div className="form-group mb-5">
                                    <div className="flex items-center mb-2">
                                        <label className="form-label block text-sm font-medium text-gray-700">
                                            Mã dịch vụ
                                        </label>
                                        <span className="text-red-500 font-bold ml-1">*</span>
                                    </div>
                                    <input
                                        type="text"
                                        name="maDichVu"
                                        value={formData.maDichVu}
                                        onChange={handleInputChange}
                                        className={`w-full h-[43px] px-4 border ${errors.maDichVu ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent`}
                                        placeholder="Nhập mã dịch vụ"
                                    />
                                    {errors.maDichVu && (
                                        <div className="error-message flex items-center mt-1.5 text-red-500">
                                            <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                            <span className="text-xs">{errors.maDichVu}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Form Group 2 - Tên dịch vụ */}
                                <div className="form-group mb-5">
                                    <div className="flex items-center mb-2">
                                        <label className="form-label block text-sm font-medium text-gray-700">
                                            Tên dịch vụ
                                        </label>
                                        <span className="text-red-500 font-bold ml-1">*</span>
                                    </div>
                                    <input
                                        type="text"
                                        name="tenDichVu"
                                        value={formData.tenDichVu}
                                        onChange={handleInputChange}
                                        className={`w-full h-[43px] px-4 border ${errors.tenDichVu ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent`}
                                        placeholder="Nhập tên dịch vụ"
                                    />
                                    {errors.tenDichVu && (
                                        <div className="error-message flex items-center mt-1.5 text-red-500">
                                            <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                            <span className="text-xs">{errors.tenDichVu}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Form Group 3 - Nhóm dịch vụ */}
                                <div className="form-group mb-5">
                                    <div className="flex items-center mb-2">
                                        <label className="form-label block text-sm font-medium text-gray-700">
                                            Nhóm dịch vụ
                                        </label>
                                        <span className="text-red-500 font-bold ml-1">*</span>
                                    </div>
                                    <div className="relative">
                                        <select
                                            name="maNhomDichVu"
                                            value={formData.maNhomDichVu}
                                            onChange={handleInputChange}
                                            className={`w-full h-[43px] px-4 border ${errors.maNhomDichVu ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white`}
                                        >
                                            <option value="">Chọn nhóm dịch vụ</option>
                                            {serviceGroups.map((group) => (
                                                <option key={group.maNhomDichVu} value={group.maNhomDichVu}>
                                                    {group.tenNhomDichVu}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                                <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.maNhomDichVu && (
                                        <div className="error-message flex items-center mt-1.5 text-red-500">
                                            <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                            <span className="text-xs">{errors.maNhomDichVu}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-layout w-1/2">
                                {/* Form Group 4 - Đơn giá */}
                                <div className="form-group mb-5">
                                    <div className="flex items-center mb-2">
                                        <label className="form-label block text-sm font-medium text-gray-700">
                                            Đơn giá
                                        </label>
                                        <span className="text-red-500 font-bold ml-1">*</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="donGia"
                                            value={formData.donGia}
                                            onChange={handleInputChange}
                                            className={`w-full h-[43px] px-4 border ${errors.donGia ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent`}
                                            placeholder="Nhập đơn giá"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                                            VNĐ
                                        </div>
                                    </div>
                                    {errors.donGia && (
                                        <div className="error-message flex items-center mt-1.5 text-red-500">
                                            <i className="fas fa-exclamation-circle text-xs mr-1.5"></i>
                                            <span className="text-xs">{errors.donGia}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Form Group 5 - Đơn vị */}
                                <div className="form-group mb-5">
                                    <div className="flex items-center mb-2">
                                        <label className="form-label block text-sm font-medium text-gray-700">
                                            Đơn vị
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        name="donVi"
                                        value={formData.donVi}
                                        onChange={handleInputChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                                        placeholder="Nhập đơn vị"
                                    />
                                </div>

                                {/* Form Group 6 - Mô tả */}
                                <div className="form-group">
                                    <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả
                                    </label>
                                    <textarea
                                        name="moTa"
                                        value={formData.moTa}
                                        onChange={handleInputChange}
                                        placeholder="Nhập mô tả dịch vụ"
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
                                        <span>Tạo dịch vụ</span>
                                    </>
                                )}
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
                                Danh sách dịch vụ
                            </h2>
                        </div>

                        {/* Search Section */}
                        <div className="search-section">
                            <div className="search-input relative">
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="w-[400px] h-[42px] pl-12 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                    placeholder="Tìm kiếm dịch vụ..."
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
                            {/* Table Header */}
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                        Mã dịch vụ
                                    </th>
                                    <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                        Tên dịch vụ
                                    </th>
                                    <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                        Nhóm dịch vụ
                                    </th>
                                    <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                        Đơn giá
                                    </th>
                                    <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                        Đơn vị
                                    </th>
                                    <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                        Mô tả
                                    </th>
                                    <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                        Sửa
                                    </th>
                                    <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                        Xóa
                                    </th>
                                </tr>
                            </thead>
                        </table>

                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                {/* Table Body */}
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : filteredServices.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                                {searchText ? (
                                                    <>
                                                        <i className="fas fa-search mr-2"></i>
                                                        Không tìm thấy dịch vụ phù hợp với "{searchText}"
                                                    </>
                                                ) : (
                                                    'Chưa có dịch vụ nào'
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredServices.map((service) => (
                                            <tr key={service.maDichVu} className="border-t border-gray-100 hover:bg-gray-50">
                                                <td className="px-4 py-4">
                                                    <div className="bg-blue-50 text-blue-700 rounded-md px-2 py-1 inline-block">
                                                        <span className="text-xs font-semibold">{service.maDichVu}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-sm font-medium text-gray-800">{service.tenDichVu}</span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="bg-green-50 text-green-700 rounded-md px-2 py-1 inline-block">
                                                        <span className="text-xs font-semibold">{service.maNhomDichVu}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-sm font-bold text-gray-800">
                                                        {parseFloat(service.donGia).toLocaleString('vi-VN')} ₫
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-sm text-gray-600">{service.donVi}</span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-sm text-gray-600">{service.moTa || '-'}</span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => handleEdit(service)}
                                                        className="border border-[#2D5016] rounded-md px-3 py-1.5 text-xs text-[#2D5016] hover:bg-[#2D5016] hover:text-white transition-colors"
                                                    >
                                                        <i className="fas fa-edit mr-1"></i>
                                                        Sửa
                                                    </button>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => handleDelete(service.maDichVu)}
                                                        className="bg-red-500 text-white rounded-md p-1.5 hover:bg-red-600 transition-colors"
                                                    >
                                                        <svg width="12" height="14" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Service Popup */}
            {isEditOpen && selectedService && (
                <EditService
                    service={selectedService}
                    onClose={handleCloseEdit}
                    onSuccess={handleEditSuccess}
                    serviceGroups={serviceGroups}
                />
            )}
        </>
    );
};

export default BudgetPage;
