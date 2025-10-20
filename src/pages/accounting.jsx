import React, { useState, useEffect } from 'react';
import DetailAccountingPopup from '../components/accounting/detailAccounting';
import AdvanceAccountingPopup from '../components/accounting/advanceAccounting';
import CompleteAccountingPopup from '../components/accounting/completeAccounting';
import PayAccountingPopup from '../components/accounting/payAccounting';
import { useReceipts, useMedicalRecords, useServices } from '../hooks/useAccounting';

const AccountingPage = () => {
    // Sử dụng custom hook để quản lý danh sách biên lai
    const { receipts, loading, error, fetchReceipts, createReceipt } = useReceipts();

    // Sử dụng custom hook để quản lý danh sách bệnh án
    const {
        medicalRecords,
        loading: loadingRecords,
        error: errorRecords,
        fetchMedicalRecords
    } = useMedicalRecords();

    // Sử dụng custom hook để quản lý danh sách dịch vụ
    const {
        services: servicesList,
        loading: loadingServices,
        error: errorServices,
        fetchServices
    } = useServices();

    // State for receipt detail popup
    const [showDetailPopup, setShowDetailPopup] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    // State for advance payment popup
    const [showAdvancePopup, setShowAdvancePopup] = useState(false);
    // State for complete payment popup
    const [showCompletePopup, setShowCompletePopup] = useState(false);
    // State for discharge payment popup
    const [showPayPopup, setShowPayPopup] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [formData, setFormData] = useState({
        patientCode: '',
        recordCode: '',
        recordType: '',
        notes: '',
        // Thêm trường dịch vụ
        serviceCode: '',
        quantity: '',
        unitPrice: '',
        insuranceRate: ''
    });

    // State lưu trữ dịch vụ đã thêm
    const [services, setServices] = useState([]);

    // State loading riêng cho form submit
    const [submitting, setSubmitting] = useState(false);

    // State cho tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // Load danh sách biên lai khi component mount
    useEffect(() => {
        fetchReceipts();
    }, [fetchReceipts]);

    // Load danh sách bệnh án khi component mount
    useEffect(() => {
        fetchMedicalRecords();
    }, [fetchMedicalRecords]);

    // Load danh sách dịch vụ khi component mount
    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    // Helper function: Format số tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
    };

    // Helper function: Format ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Helper function: Format ngày giờ đầy đủ
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper function: Lấy trạng thái thanh toán
    const getPaymentStatus = (status) => {
        switch (status) {
            case 0:
                return { label: 'CHƯA TT', className: 'bg-red-50 text-red-600' };
            case 1:
                return { label: 'ĐÃ TT', className: 'bg-green-50 text-green-800' };
            case 2:
                return { label: 'TẠM ỨNG', className: 'bg-yellow-50 text-yellow-600' };
            default:
                return { label: 'KHÔNG XĐ', className: 'bg-gray-50 text-gray-600' };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (!formData.recordCode) {
            alert('Vui lòng nhập mã hồ sơ');
            return;
        }

        if (!formData.recordType) {
            alert('Vui lòng chọn loại hồ sơ');
            return;
        }

        if (services.length === 0) {
            alert('Vui lòng thêm ít nhất một dịch vụ');
            return;
        }

        try {
            setSubmitting(true);

            // Chuẩn bị dữ liệu theo format BE
            const receiptData = {
                maHoSo: formData.recordCode,
                loaiHoSo: formData.recordType === 'ngoai-tru' ? 1 : 2, // 1: Ngoại trú, 2: Nội trú
                chiTiet: services.map(service => ({
                    maDichVu: service.serviceCode,
                    soLuong: parseFloat(service.quantity),
                    donGia: parseFloat(service.unitPrice),
                    tyLeBaoHiem: parseFloat(service.insuranceRate) || 0
                })),
                ghiChu: formData.notes
            };

            // Gọi API tạo biên lai
            await createReceipt(receiptData);

            alert('Lập biên lai thành công!');

            // Reset form
            setFormData({
                patientCode: '',
                recordCode: '',
                recordType: '',
                notes: '',
                serviceCode: '',
                quantity: '',
                unitPrice: '',
                insuranceRate: ''
            });
            setServices([]);

        } catch (error) {
            console.error('Error creating receipt:', error);
            alert(error.message || 'Không thể lập biên lai. Vui lòng thử lại!');
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý khi chọn mã hồ sơ
    const handleRecordCodeChange = (e) => {
        const selectedRecordCode = e.target.value;

        // Tìm bệnh án được chọn
        const selectedRecord = medicalRecords.find(record => record.maHoSo === selectedRecordCode);

        if (selectedRecord) {
            // Auto-fill loại hồ sơ (1: Nội trú, 2: Ngoại trú - theo backend)
            const recordType = selectedRecord.loaiHoSo === 1 ? 'ngoai-tru' : 'noi-tru';

            setFormData(prev => ({
                ...prev,
                recordCode: selectedRecordCode,
                recordType: recordType,
                patientCode: selectedRecord.maBenhNhan // Cũng auto-fill mã bệnh nhân
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                recordCode: selectedRecordCode
            }));
        }
    };

    // Xử lý khi chọn dịch vụ
    const handleServiceChange = (e) => {
        const selectedServiceCode = e.target.value;

        // Tìm dịch vụ được chọn
        const selectedService = servicesList.find(service => service.maDichVu === selectedServiceCode);

        if (selectedService) {
            // Auto-fill số lượng (mặc định là 1), đơn giá, và tỷ lệ bảo hiểm
            setFormData(prev => ({
                ...prev,
                serviceCode: selectedServiceCode,
                quantity: '1', // Mặc định số lượng là 1
                unitPrice: selectedService.donGia,
                insuranceRate: selectedService.tyLeBaoHiem || '0'
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                serviceCode: selectedServiceCode,
                quantity: '',
                unitPrice: '',
                insuranceRate: ''
            }));
        }
    };

    // Xử lý thêm dịch vụ
    const handleAddService = () => {
        // Kiểm tra dữ liệu hợp lệ
        if (!formData.serviceCode || !formData.quantity || !formData.unitPrice) {
            alert('Vui lòng nhập đầy đủ thông tin dịch vụ');
            return;
        }

        // Tìm tên dịch vụ
        const selectedService = servicesList.find(service => service.maDichVu === formData.serviceCode);
        const serviceName = selectedService ? selectedService.tenDichVu : formData.serviceCode;

        // Tính thành tiền = Số lượng × Đơn giá × (Tỷ lệ BH / 100)
        const quantity = parseFloat(formData.quantity);
        const unitPrice = parseFloat(formData.unitPrice);
        const insuranceRate = parseFloat(formData.insuranceRate || 0);
        const amount = quantity * unitPrice * (insuranceRate / 100);

        // Thêm dịch vụ vào danh sách
        const newService = {
            id: Date.now(), // ID tạm thời
            serviceCode: formData.serviceCode,
            serviceName: serviceName, // Thêm tên dịch vụ để hiển thị
            quantity: formData.quantity,
            unitPrice: formData.unitPrice,
            insuranceRate: formData.insuranceRate || 0,
            amount
        };

        setServices([...services, newService]);

        // Reset form dịch vụ
        setFormData(prev => ({
            ...prev,
            serviceCode: '',
            quantity: '',
            unitPrice: '',
            insuranceRate: ''
        }));
    };

    // Xử lý xóa dịch vụ
    const handleRemoveService = (id) => {
        setServices(services.filter(service => service.id !== id));
    };

    // Xử lý hiển thị chi tiết biên lai
    const handleViewDetail = (receipt) => {
        setSelectedReceipt(receipt);
        setShowDetailPopup(true);
    };

    // Xử lý hiển thị popup tạm ứng
    const handleAdvanceClick = (receipt) => {
        // Tạo dữ liệu cho popup tạm ứng từ thông tin biên lai
        const recordData = {
            recordCode: receipt.recordCode,
            totalAmount: receipt.totalAmount,
            advancedAmount: 0 // Giả định là chưa có tạm ứng trước đó
        };
        setSelectedRecord(recordData);
        setShowAdvancePopup(true);
    };

    // Xử lý hiển thị popup hoàn ứng
    const handleCompleteClick = (receipt) => {
        // Lấy thông tin tạm ứng đầu tiên (hoặc tìm tạm ứng chưa sử dụng hết)
        const tamUng = receipt.tamUngs && receipt.tamUngs.length > 0
            ? receipt.tamUngs[0]
            : null;

        // Tạo dữ liệu cho popup hoàn ứng từ thông tin biên lai
        const recordData = {
            recordCode: receipt.recordCode || receipt.maHoSo,
            totalAmount: receipt.totalAmount || parseFloat(receipt.tongTien),
            advanceCode: tamUng ? tamUng.maTamUng : '',
            advancedAmount: tamUng ? parseFloat(tamUng.soTien) : 0,
            usedAmount: tamUng ? parseFloat(tamUng.soTienDaSuDung || 0) : 0,
            tamUngs: receipt.tamUngs || [] // Truyền toàn bộ danh sách tạm ứng
        };
        setSelectedRecord(recordData);
        setShowCompletePopup(true);
    };

    // Xử lý hiển thị popup thanh toán ra viện
    const handlePaymentClick = (receipt) => {
        // Tạo dữ liệu cho popup thanh toán từ thông tin biên lai
        const recordData = {
            recordCode: receipt.recordCode,
            totalAmount: receipt.totalAmount,
            advancedAmount: receipt.advancedAmount || 0
        };
        setSelectedRecord(recordData);
        setShowPayPopup(true);
    };

    // Xử lý tìm kiếm
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter receipts dựa trên searchTerm
    const filteredReceipts = receipts.filter(receipt => {
        if (!searchTerm.trim()) return true;

        const searchLower = searchTerm.toLowerCase().trim();

        // Tìm kiếm theo các trường
        return (
            // Mã viện phí
            receipt.maVienPhi?.toLowerCase().includes(searchLower) ||
            // Mã hồ sơ
            receipt.maHoSo?.toLowerCase().includes(searchLower) ||
            // Tiền bệnh nhân trả
            receipt.tienBenhNhanTra?.toString().includes(searchLower) ||
            // Tổng tiền
            receipt.tongTien?.toString().includes(searchLower) ||
            // Ngày tạo (format)
            formatDate(receipt.ngayTao).includes(searchLower) ||
            // Trạng thái (tìm theo text hiển thị)
            getPaymentStatus(receipt.trangThaiThanhToan).label.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="accounting-page">
            {/* Form Card */}
            <div className="form-card bg-white rounded-[15px] border border-gray-200 shadow-sm mb-8">
                {/* Card Title */}
                <div className="card-title px-8 py-6 ">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className="fas fa-file-invoice text-[#2D5016] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Lập biên lai viện phí
                        </h2>
                    </div>
                </div>

                {/* Form Layout */}
                <form onSubmit={handleSubmit} className="p-8">
                    <div className='flex justify-between gap-8'>
                        <div className="form-layout w-1/2">
                            {/* Form Group 1 - Mã hồ sơ */}
                            <div className="form-group mb-5">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Mã hồ sơ <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="recordCode"
                                        value={formData.recordCode}
                                        onChange={handleRecordCodeChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white"
                                        disabled={loadingRecords}
                                    >
                                        <option value="">
                                            {loadingRecords ? 'Đang tải...' : 'Chọn mã hồ sơ'}
                                        </option>
                                        {medicalRecords.map((record) => (
                                            <option key={record.maHoSo} value={record.maHoSo}>
                                                {record.maHoSo} - {record.maBenhNhan} ({record.loaiHoSo === 1 ? 'Ngoại trú' : 'Nội trú'})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                            <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                {errorRecords && (
                                    <p className="text-red-500 text-xs mt-1">{errorRecords}</p>
                                )}
                            </div>

                            {/* Form Group 2 - Loại hồ sơ */}
                            <div className="form-group mb-5">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Loại hồ sơ <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="recordType"
                                        value={formData.recordType}
                                        onChange={handleInputChange}
                                        disabled={true}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-gray-100 cursor-not-allowed"
                                    >
                                        <option value="">Chọn loại hồ sơ</option>
                                        <option value="ngoai-tru">Ngoại trú</option>
                                        <option value="noi-tru">Nội trú</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                            <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Tự động điền khi chọn mã hồ sơ
                                </p>
                            </div>

                            {/* Form Group 3 - Ghi chú */}
                            <div className="form-group mb-5">
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

                        {/* Chi tiết dịch vụ - Thêm từ Figma */}
                        <div className="service-section w-1/2 border rounded-[15px] bg-gray-50 border-gray-200 p-8">
                            <h3 className="text-base font-semibold text-gray-800 mb-4">Chi tiết dịch vụ</h3>

                            {/* Service Row - Dịch vụ, Số lượng, Đơn giá */}
                            <div className="service-row flex flex-wrap gap-4">
                                {/* Form Group - Mã dịch vụ (Dropdown) */}
                                <div className="form-group">
                                    <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                        Dịch vụ <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="serviceCode"
                                            value={formData.serviceCode}
                                            onChange={handleServiceChange}
                                            className="w-[200px] h-[43px] px-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white"
                                            disabled={loadingServices}
                                        >
                                            <option value="">
                                                {loadingServices ? 'Đang tải...' : 'Chọn dịch vụ'}
                                            </option>
                                            {servicesList.map((service) => (
                                                <option key={service.maDichVu} value={service.maDichVu}>
                                                    {service.tenDichVu}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                                <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errorServices && (
                                        <p className="text-red-500 text-xs mt-1">{errorServices}</p>
                                    )}
                                </div>

                                {/* Form Group - Số lượng */}
                                <div className="form-group">
                                    <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                        SL <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        placeholder="SL"
                                        min="1"
                                        className="w-[70px] h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white"
                                    />
                                </div>

                                {/* Form Group - Đơn giá */}
                                <div className="form-group">
                                    <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                        Đơn giá <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="unitPrice"
                                        value={formData.unitPrice}
                                        onChange={handleInputChange}
                                        placeholder="Đơn giá"
                                        className="w-[120px] h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-gray-100 cursor-not-allowed"
                                        disabled={true}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        <i className="fas fa-info-circle mr-1"></i>
                                        Tự động điền
                                    </p>
                                </div>

                                {/* Form Group - Tỷ lệ BH */}
                                <div className="form-group">
                                    <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                        TL BH (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="insuranceRate"
                                        value={formData.insuranceRate}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                        className="w-[80px] h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-gray-100 cursor-not-allowed"
                                        disabled={true}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        <i className="fas fa-info-circle mr-1"></i>
                                        Tự động điền
                                    </p>
                                </div>

                                {/* Button - Thêm dịch vụ */}
                                <div className="form-group self-end">
                                    <button
                                        type="button"
                                        onClick={handleAddService}
                                        className="h-[42px] px-4 bg-[#2D5016] text-white font-medium rounded-lg flex items-center gap-2 hover:shadow-md hover:bg-[#4A7C23] hover:scale-105 cursor-pointer transition-all duration-200"
                                    >
                                        <i className="fas fa-plus text-xs"></i>
                                        <span>Thêm</span>
                                    </button>
                                </div>
                            </div>

                            {/* Service Table */}
                            {services.length > 0 && (
                                <div className="service-table mt-8 border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-4 text-left text-xs font-semibold text-gray-500">DỊCH VỤ</th>
                                                <th className="p-4 text-center text-xs font-semibold text-gray-500">SỐ LƯỢNG</th>
                                                <th className="p-4 text-center text-xs font-semibold text-gray-500">ĐƠN GIÁ</th>
                                                <th className="p-4 text-center text-xs font-semibold text-gray-500">TL BH (%)</th>
                                                <th className="p-4 text-center text-xs font-semibold text-gray-500">THÀNH TIỀN</th>
                                                <th className="p-4 text-center text-xs font-semibold text-gray-500"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {services.map(service => (
                                                <tr key={service.id} className="border-t border-gray-100 bg-white">
                                                    <td className="p-4 text-sm text-gray-800">{service.serviceCode}</td>
                                                    <td className="p-4 text-sm text-gray-800 text-center">{service.quantity}</td>
                                                    <td className="p-4 text-sm text-gray-800 text-center">{parseFloat(service.unitPrice).toLocaleString()} ₫</td>
                                                    <td className="p-4 text-sm text-gray-800 text-center">{service.insuranceRate || 0}%</td>
                                                    <td className="p-4 text-sm text-gray-800 text-center font-bold">{service.amount.toLocaleString()} ₫</td>
                                                    <td className="p-4 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveService(service.id)}
                                                            className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer transition-all"
                                                        >
                                                            <i className="fas fa-times text-xs"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Section - Di chuyển vào giữa */}
                    <div className="submit-section flex justify-center mt-10">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary h-[51px] px-12 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white font-bold text-base rounded-lg hover:shadow-xl hover:bg-[#3D6B1D] cursor-pointer transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Đang xử lý...
                                </>
                            ) : (
                                'Lập biên lai viện phí'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danh sách biên lai viện phí */}
            <div className="receipt-list-card bg-white rounded-[15px] border border-gray-200 shadow-sm">
                {/* Card Header */}
                <div className="card-header px-8 py-6 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className="fas fa-list text-[#2D5016] text-xl"></i>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Danh sách biên lai viện phí
                            </h2>
                            {searchTerm && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Tìm thấy {filteredReceipts.length} kết quả cho "{searchTerm}"
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="search-section">
                        <div className="relative w-[400px]">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full h-[42px] pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                                placeholder="Tìm kiếm mã viện phí, mã hồ sơ, trạng thái..."
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <i className="fas fa-search"></i>
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="table-container overflow-x-auto max-h-[360px]">
                    <table className="w-full">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-gray-50">
                                <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500">MÃ VIỆN PHÍ</th>
                                <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500">MÃ HỒ SƠ</th>
                                <th className="py-4 px-4 text-center text-xs font-semibold text-gray-500">TIỀN BN TRẢ</th>
                                <th className="py-4 px-4 text-center text-xs font-semibold text-gray-500">TỔNG TIỀN</th>
                                <th className="py-4 px-4 text-center text-xs font-semibold text-gray-500">TRẠNG THÁI</th>
                                <th className="py-4 px-4 text-center text-xs font-semibold text-gray-500">NGÀY TẠO</th>
                                <th className="py-4 px-4 text-center text-xs font-semibold text-gray-500">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-500">
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-red-500">
                                        <i className="fas fa-exclamation-circle mr-2"></i>
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredReceipts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-500">
                                        <i className="fas fa-inbox mr-2"></i>
                                        {searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : 'Chưa có biên lai nào'}
                                    </td>
                                </tr>
                            ) : (
                                filteredReceipts.map((receipt, index) => {
                                    const paymentStatus = getPaymentStatus(receipt.trangThaiThanhToan);
                                    return (
                                        <tr
                                            key={receipt.maVienPhi}
                                            className={index % 2 === 0 ? 'border-t border-gray-100' : 'border-t border-gray-100 bg-white'}
                                        >
                                            <td className="py-4 px-4 text-sm text-gray-800">{receipt.maVienPhi}</td>
                                            <td className="py-4 px-4 text-sm text-gray-800">{receipt.maHoSo}</td>
                                            <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">
                                                {formatCurrency(receipt.tienBenhNhanTra)}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">
                                                {formatCurrency(receipt.tongTien)}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`px-3 py-1 ${paymentStatus.className} text-xs rounded-full`}>
                                                    {paymentStatus.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-800 text-center">
                                                {formatDate(receipt.ngayTao)}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    onClick={() => handleViewDetail({
                                                        code: receipt.maVienPhi,
                                                        recordCode: receipt.maHoSo,
                                                        maHoSo: receipt.maHoSo,
                                                        createdDate: formatDateTime(receipt.ngayTao),
                                                        collector: receipt.maNguoiThu || 'N/A',
                                                        totalAmount: parseFloat(receipt.tongTien),
                                                        tongTien: receipt.tongTien,
                                                        patientPaid: parseFloat(receipt.tienBenhNhanTra),
                                                        tienBenhNhanTra: receipt.tienBenhNhanTra,
                                                        insuranceRate: `${receipt.tyLeBaoHiem}%`,
                                                        insuranceAmount: parseFloat(receipt.tienBaoHiem),
                                                        tienBaoHiem: receipt.tienBaoHiem,
                                                        status: receipt.trangThaiThanhToan === 1 ? 'paid' : 'unpaid',
                                                        note: receipt.ghiChu || '',
                                                        // Thêm các trường chi phí
                                                        tienKham: receipt.tienKham || 0,
                                                        tienThuoc: receipt.tienThuoc || 0,
                                                        tienXetNghiem: receipt.tienXetNghiem || 0,
                                                        tienGiuong: receipt.tienGiuong || 0,
                                                        tienPhauThuat: receipt.tienPhauThuat || 0,
                                                        tienKhac: receipt.tienKhac || 0,
                                                        // Thêm dữ liệu tạm ứng và hoàn ứng
                                                        tamUngs: receipt.tamUngs || [],
                                                        tongTienHoanUng: receipt.tongTienHoanUng || 0,
                                                        chiTietHoanUng: receipt.chiTietHoanUng || [],
                                                        services: receipt.chiTietVienPhi?.map(detail => ({
                                                            code: detail.maDichVu,
                                                            quantity: parseFloat(detail.soLuong),
                                                            unitPrice: parseFloat(detail.donGia),
                                                            amount: parseFloat(detail.thanhTien),
                                                            insuranceAmount: parseFloat(detail.tienBaoHiem || 0)
                                                        })) || []
                                                    })}
                                                    className="px-3 py-1.5 border border-gray-200 rounded text-gray-500 text-xs hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    Chi tiết
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

            {/* Popup chi tiết viện phí */}
            <DetailAccountingPopup
                isOpen={showDetailPopup}
                onClose={() => setShowDetailPopup(false)}
                receiptData={selectedReceipt}
                onAdvanceClick={handleAdvanceClick}
                onCompleteClick={handleCompleteClick}
                onPaymentClick={handlePaymentClick}
            />

            {/* Popup tạm ứng viện phí */}
            <AdvanceAccountingPopup
                isOpen={showAdvancePopup}
                onClose={() => setShowAdvancePopup(false)}
                recordData={selectedRecord}
            />

            {/* Popup hoàn ứng viện phí */}
            <CompleteAccountingPopup
                isOpen={showCompletePopup}
                onClose={() => setShowCompletePopup(false)}
                recordData={selectedRecord}
            />

            {/* Popup thanh toán ra viện */}
            <PayAccountingPopup
                isOpen={showPayPopup}
                onClose={() => setShowPayPopup(false)}
                recordData={selectedRecord}
            />
        </div>
    );
};

export default AccountingPage;
