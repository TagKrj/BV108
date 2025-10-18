import React, { useState } from 'react';
import DetailAccountingPopup from '../components/accounting/detailAccounting';
import AdvanceAccountingPopup from '../components/accounting/advanceAccounting';
import CompleteAccountingPopup from '../components/accounting/completeAccounting';
import PayAccountingPopup from '../components/accounting/payAccounting';

const AccountingPage = () => {
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
        recordType: '',
        notes: '',
        // Thêm trường dịch vụ
        serviceCode: '',
        quantity: '',
        unitPrice: ''
    });

    // State lưu trữ dịch vụ đã thêm
    const [services, setServices] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        console.log('Services:', services);
        // TODO: Call API to submit form
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý thêm dịch vụ
    const handleAddService = () => {
        // Kiểm tra dữ liệu hợp lệ
        if (!formData.serviceCode || !formData.quantity || !formData.unitPrice) {
            alert('Vui lòng nhập đầy đủ thông tin dịch vụ');
            return;
        }

        // Tính thành tiền
        const amount = parseFloat(formData.quantity) * parseFloat(formData.unitPrice);

        // Thêm dịch vụ vào danh sách
        const newService = {
            id: Date.now(), // ID tạm thời
            serviceCode: formData.serviceCode,
            quantity: formData.quantity,
            unitPrice: formData.unitPrice,
            amount
        };

        setServices([...services, newService]);

        // Reset form dịch vụ
        setFormData(prev => ({
            ...prev,
            serviceCode: '',
            quantity: '',
            unitPrice: ''
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
        // Tạo dữ liệu cho popup hoàn ứng từ thông tin biên lai
        const recordData = {
            recordCode: receipt.recordCode,
            totalAmount: receipt.totalAmount,
            advancedAmount: 50000 // Giả định đã có tạm ứng trước đó
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
                            {/* Form Group 1 - Mã bệnh nhân */}
                            <div className="form-group mb-5">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Mã bệnh nhân
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="patientCode"
                                        value={formData.patientCode}
                                        onChange={handleInputChange}
                                        placeholder="Nhập mã bệnh nhân"
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Form Group 2 - Loại hồ sơ */}
                            <div className="form-group mb-5">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Loại hồ sơ
                                </label>
                                <div className="relative">
                                    <select
                                        name="recordType"
                                        value={formData.recordType}
                                        onChange={handleInputChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white"
                                    >
                                        <option value="">Chọn loại hồ sơ</option>
                                        <option value="ngoai-tru">Ngoại trú</option>
                                        <option value="noi-tru">Nội trú</option>
                                        <option value="cap-cuu">Cấp cứu</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                                            <path d="M1 1L6 5L11 1" stroke="#8C8C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
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
                                {/* Form Group - Mã dịch vụ */}
                                <div className="form-group">
                                    <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                        Mã dịch vụ <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="serviceCode"
                                            value={formData.serviceCode}
                                            onChange={handleInputChange}
                                            placeholder="Nhập mã dịch vụ"
                                            className="w-[157px] h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Form Group - Số lượng */}
                                <div className="form-group">
                                    <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                        Số lượng <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        placeholder="Số lượng"
                                        className="w-[78px] h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white"
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
                                        className="w-[78px] h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white"
                                    />
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
                                                <th className="p-4 text-center text-xs font-semibold text-gray-500">THÀNH TIỀN</th>
                                                <th className="p-4 text-center text-xs font-semibold text-gray-500"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {services.map(service => (
                                                <tr key={service.id} className="border-t border-gray-100 bg-white">
                                                    <td className="p-4 text-sm text-gray-800">{service.serviceCode}</td>
                                                    <td className="p-4 text-sm text-gray-800 text-center">{service.quantity}</td>
                                                    <td className="p-4 text-sm text-gray-800 text-center">{service.unitPrice} ₫</td>
                                                    <td className="p-4 text-sm text-gray-800 text-center">{service.amount} ₫</td>
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
                            className="btn-primary h-[51px] px-12 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white font-bold text-base rounded-lg hover:shadow-xl hover:bg-[#3D6B1D] cursor-pointer transition-all duration-300 active:scale-95"
                        >
                            Lập biên lai viện phí
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
                        <h2 className="text-xl font-semibold text-gray-800">
                            Danh sách biên lai viện phí
                        </h2>
                    </div>

                    {/* Search Input */}
                    <div className="search-section">
                        <div className="relative w-[400px]">
                            <input
                                type="text"
                                className="w-full h-[42px] pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                                placeholder="Tìm kiếm biên lai..."
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <i className="fas fa-search"></i>
                            </div>
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
                            {/* Row 1 */}
                            <tr className="border-t border-gray-100">
                                <td className="py-4 px-4 text-sm text-gray-800">VP2025000008</td>
                                <td className="py-4 px-4 text-sm text-gray-800">HS001</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">200,000 ₫</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">200,000 ₫</td>
                                <td className="py-4 px-4 text-center">
                                    <span className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full">CHƯA TT</span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center">07/10/2025</td>
                                <td className="py-4 px-4 text-center">
                                    <button
                                        onClick={() => handleViewDetail({
                                            code: 'VP2025000008',
                                            recordCode: 'HS001',
                                            createdDate: '07/10/2025 - 16:18',
                                            collector: 'admin',
                                            totalAmount: 200000,
                                            patientPaid: 200000,
                                            insuranceRate: '0%',
                                            insuranceAmount: 0,
                                            status: 'unpaid',
                                            note: 'Khám tổng quát',
                                            services: [
                                                {
                                                    code: 'DV001',
                                                    quantity: 1,
                                                    unitPrice: 200000,
                                                    amount: 200000,
                                                    insuranceAmount: 0
                                                }
                                            ]
                                        })}
                                        className="px-3 py-1.5 border border-gray-200 rounded text-gray-500 text-xs hover:bg-gray-50 cursor-pointer"
                                    >
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>

                            {/* Row 2 */}
                            <tr className="border-t border-gray-100 bg-white">
                                <td className="py-4 px-4 text-sm text-gray-800">VP2025000007</td>
                                <td className="py-4 px-4 text-sm text-gray-800">HS002</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">150,000 ₫</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">180,000 ₫</td>
                                <td className="py-4 px-4 text-center">
                                    <span className="px-3 py-1 bg-green-50 text-green-800 text-xs rounded-full">ĐÃ TT</span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center">06/10/2025</td>
                                <td className="py-4 px-4 text-center">
                                    <button className="px-3 py-1.5 border border-gray-200 rounded text-gray-500 text-xs hover:bg-gray-50">
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>

                            {/* Row 3 */}
                            <tr className="border-t border-gray-100">
                                <td className="py-4 px-4 text-sm text-gray-800">VP2025000006</td>
                                <td className="py-4 px-4 text-sm text-gray-800">HS003</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">320,000 ₫</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">450,000 ₫</td>
                                <td className="py-4 px-4 text-center">
                                    <span className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full">CHƯA TT</span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center">05/10/2025</td>
                                <td className="py-4 px-4 text-center">
                                    <button
                                        onClick={() => handleViewDetail({
                                            code: 'VP2025000006',
                                            recordCode: 'HS003',
                                            createdDate: '05/10/2025 - 10:15',
                                            collector: 'admin',
                                            totalAmount: 450000,
                                            patientPaid: 320000,
                                            insuranceRate: '30%',
                                            insuranceAmount: 130000,
                                            status: 'unpaid',
                                            note: 'Khám nội',
                                            services: [
                                                {
                                                    code: 'DV003',
                                                    quantity: 1,
                                                    unitPrice: 300000,
                                                    amount: 300000,
                                                    insuranceAmount: 90000
                                                },
                                                {
                                                    code: 'DV004',
                                                    quantity: 1,
                                                    unitPrice: 150000,
                                                    amount: 150000,
                                                    insuranceAmount: 40000
                                                }
                                            ]
                                        })}
                                        className="px-3 py-1.5 border border-gray-200 rounded text-gray-500 text-xs hover:bg-gray-50">
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>

                            {/* Row 4 */}
                            <tr className="border-t border-gray-100 bg-white">
                                <td className="py-4 px-4 text-sm text-gray-800">VP2025000005</td>
                                <td className="py-4 px-4 text-sm text-gray-800">HS004</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">85,000 ₫</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">85,000 ₫</td>
                                <td className="py-4 px-4 text-center">
                                    <span className="px-3 py-1 bg-green-50 text-green-800 text-xs rounded-full">ĐÃ TT</span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center">04/10/2025</td>
                                <td className="py-4 px-4 text-center">
                                    <button
                                        onClick={() => handleViewDetail({
                                            code: 'VP2025000005',
                                            recordCode: 'HS004',
                                            createdDate: '04/10/2025 - 09:45',
                                            collector: 'admin',
                                            totalAmount: 85000,
                                            patientPaid: 85000,
                                            insuranceRate: '0%',
                                            insuranceAmount: 0,
                                            status: 'paid',
                                            note: 'Phí giấy tờ',
                                            services: [
                                                {
                                                    code: 'DV005',
                                                    quantity: 1,
                                                    unitPrice: 85000,
                                                    amount: 85000,
                                                    insuranceAmount: 0
                                                }
                                            ]
                                        })}
                                        className="px-3 py-1.5 border border-gray-200 rounded text-gray-500 text-xs hover:bg-gray-50"
                                    >
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>

                            {/* Row 5 */}
                            <tr className="border-t border-gray-100">
                                <td className="py-4 px-4 text-sm text-gray-800">VP2025000004</td>
                                <td className="py-4 px-4 text-sm text-gray-800">HS005</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">275,000 ₫</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">350,000 ₫</td>
                                <td className="py-4 px-4 text-center">
                                    <span className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full">CHƯA TT</span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center">03/10/2025</td>
                                <td className="py-4 px-4 text-center">
                                    <button
                                        onClick={() => handleViewDetail({
                                            code: 'VP2025000004',
                                            recordCode: 'HS005',
                                            createdDate: '03/10/2025 - 11:30',
                                            collector: 'admin',
                                            totalAmount: 350000,
                                            patientPaid: 275000,
                                            insuranceRate: '25%',
                                            insuranceAmount: 75000,
                                            status: 'unpaid',
                                            note: 'Xét nghiệm',
                                            services: [
                                                {
                                                    code: 'DV006',
                                                    quantity: 1,
                                                    unitPrice: 350000,
                                                    amount: 350000,
                                                    insuranceAmount: 75000
                                                }
                                            ]
                                        })}
                                        className="px-3 py-1.5 border border-gray-200 rounded text-gray-500 text-xs hover:bg-gray-50"
                                    >
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>

                            {/* Row 6 */}
                            <tr className="border-t border-gray-100 bg-white">
                                <td className="py-4 px-4 text-sm text-gray-800">VP2025000003</td>
                                <td className="py-4 px-4 text-sm text-gray-800">HS006</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">275,000 ₫</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">350,000 ₫</td>
                                <td className="py-4 px-4 text-center">
                                    <span className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full">CHƯA TT</span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center">02/10/2025</td>
                                <td className="py-4 px-4 text-center">
                                    <button
                                        onClick={() => handleViewDetail({
                                            code: 'VP2025000003',
                                            recordCode: 'HS006',
                                            createdDate: '02/10/2025 - 08:45',
                                            collector: 'admin',
                                            totalAmount: 350000,
                                            patientPaid: 275000,
                                            insuranceRate: '25%',
                                            insuranceAmount: 75000,
                                            status: 'unpaid',
                                            note: 'CT scan',
                                            services: [
                                                {
                                                    code: 'DV007',
                                                    quantity: 1,
                                                    unitPrice: 350000,
                                                    amount: 350000,
                                                    insuranceAmount: 75000
                                                }
                                            ]
                                        })}
                                        className="px-3 py-1.5 border border-gray-200 rounded text-gray-500 text-xs hover:bg-gray-50"
                                    >
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>

                            {/* Row 7 */}
                            <tr className="border-t border-gray-100">
                                <td className="py-4 px-4 text-sm text-gray-800">VP2025000002</td>
                                <td className="py-4 px-4 text-sm text-gray-800">HS007</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">185,000 ₫</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">220,000 ₫</td>
                                <td className="py-4 px-4 text-center">
                                    <span className="px-3 py-1 bg-green-50 text-green-800 text-xs rounded-full">ĐÃ TT</span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center">01/10/2025</td>
                                <td className="py-4 px-4 text-center">
                                    <button className="px-3 py-1.5 border border-gray-200 rounded text-gray-500 text-xs hover:bg-gray-50">
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>

                            {/* Row 8 */}
                            <tr className="border-t border-gray-100 bg-white">
                                <td className="py-4 px-4 text-sm text-gray-800">VP2025000001</td>
                                <td className="py-4 px-4 text-sm text-gray-800">HS008</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">420,000 ₫</td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center font-bold">420,000 ₫</td>
                                <td className="py-4 px-4 text-center">
                                    <span className="px-3 py-1 bg-green-50 text-green-800 text-xs rounded-full">ĐÃ TT</span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-800 text-center">30/09/2025</td>
                                <td className="py-4 px-4 text-center">
                                    <button className="px-3 py-1.5 border border-gray-200 rounded text-gray-500 text-xs hover:bg-gray-50">
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
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
