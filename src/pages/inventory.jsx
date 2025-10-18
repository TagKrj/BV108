import React, { useState } from 'react';

const InventoryPage = () => {
    // State for form tabs
    const [activeTab, setActiveTab] = useState('import'); // 'import' or 'export'

    // Mock data for stock warnings
    const stockWarnings = [
        {
            maKho: "KHO001",
            tenKho: "Kho tổng",
            maThuoc: "THUOC001",
            tenThuoc: "Paracetamol 500mg",
            soLo: "LOT2024001",
            hanSuDung: "2026-12-31",
            tonDau: 200,
            nhapTrongKy: 100,
            xuatTrongKy: 50,
            tonCuoi: 250,
            giaTriTon: 12500000
        },
        {
            maKho: "KHO001",
            tenKho: "Kho tổng",
            maThuoc: "THUOC004",
            tenThuoc: "Vitamin C 1000mg",
            soLo: "LOT2024004",
            hanSuDung: "2025-06-30",
            tonDau: 500,
            nhapTrongKy: 200,
            xuatTrongKy: 150,
            tonCuoi: 550,
            giaTriTon: 27500000
        }
    ];

    // Mock data for expiry warnings
    const expiryWarnings = [
        {
            maKho: "KHO001",
            tenKho: "Kho tổng",
            maThuoc: "THUOC002",
            tenThuoc: "Amoxicillin 500mg",
            soLo: "LOT2024002",
            hanSuDung: "2025-01-15",
            soLuongTon: 150,
            soNgayConLai: 100,
            mucDoUuTien: "CANH_BAO"
        },
        {
            maKho: "KHO001",
            tenKho: "Kho tổng",
            maThuoc: "THUOC003",
            tenThuoc: "Ibuprofen 400mg",
            soLo: "LOT2024003",
            hanSuDung: "2024-12-31",
            soLuongTon: 80,
            soNgayConLai: 85,
            mucDoUuTien: "KHAN_CAP"
        }
    ];

    // Mock data for inventory list
    const mockInventory = [
        {
            id: 'PN001',
            maKho: 'KHO001',
            tenKho: 'Kho tổng',
            loaiPhieu: 'NHAP_MUA',
            maNhaCungCap: 'NCC001',
            tenNhaCungCap: 'Công ty TNHH Y tế ABC',
            ngayTao: '01/10/2024',
            tongTien: '5,000,000',
            trangThai: 'completed',
            ghiChu: 'Nhập thuốc tháng 10'
        },
        {
            id: 'PX001',
            maKho: 'KHO001',
            tenKho: 'Kho tổng',
            loaiPhieu: 'XUAT_CAP_PHAT',
            maKhoaNhan: 'KHOA01',
            tenKhoaNhan: 'Khoa Nội',
            ngayTao: '02/10/2024',
            tongTien: '2,500,000',
            trangThai: 'completed',
            ghiChu: 'Cấp phát cho khoa nội'
        },
        {
            id: 'PN002',
            maKho: 'KHO001',
            tenKho: 'Kho tổng',
            loaiPhieu: 'NHAP_MUA',
            maNhaCungCap: 'NCC002',
            tenNhaCungCap: 'Công ty CP Dược phẩm XYZ',
            ngayTao: '05/10/2024',
            tongTien: '8,500,000',
            trangThai: 'pending',
            ghiChu: 'Nhập vật tư y tế'
        },
        {
            id: 'PX002',
            maKho: 'KHO001',
            tenKho: 'Kho tổng',
            loaiPhieu: 'XUAT_CAP_PHAT',
            maKhoaNhan: 'KHOA02',
            tenKhoaNhan: 'Khoa Ngoại',
            ngayTao: '07/10/2024',
            tongTien: '3,200,000',
            trangThai: 'pending',
            ghiChu: 'Cấp phát khẩn cấp'
        }
    ];

    // Form state for import slip
    const [importFormData, setImportFormData] = useState({
        maKho: '',
        loaiPhieu: 'NHAP_MUA',
        maNhaCungCap: '',
        ghiChu: '',
        maThuoc: '',
        soLo: '',
        hanSuDung: '',
        soLuong: '',
        donGia: '',
        VAT: ''
    });

    // Form state for export slip
    const [exportFormData, setExportFormData] = useState({
        maKho: '',
        loaiPhieu: 'XUAT_CAP_PHAT',
        maKhoaNhan: '',
        ghiChu: '',
        maThuoc: '',
        soLo: '',
        soLuong: '',
        donGia: ''
    });

    // Handle input change for import form
    const handleImportChange = (e) => {
        const { name, value } = e.target;

        if (name === 'donGia' || name === 'soLuong') {
            const numericValue = value.replace(/[^0-9]/g, '');
            const formattedValue = numericValue ?
                new Intl.NumberFormat('vi-VN').format(parseInt(numericValue)) : '';
            setImportFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setImportFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle input change for export form
    const handleExportChange = (e) => {
        const { name, value } = e.target;

        if (name === 'donGia' || name === 'soLuong') {
            const numericValue = value.replace(/[^0-9]/g, '');
            const formattedValue = numericValue ?
                new Intl.NumberFormat('vi-VN').format(parseInt(numericValue)) : '';
            setExportFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setExportFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle import form submission
    const handleImportSubmit = (e) => {
        e.preventDefault();
        console.log('Import form submitted:', importFormData);
        alert('Đã tạo phiếu nhập thành công!');
    };

    // Handle export form submission
    const handleExportSubmit = (e) => {
        e.preventDefault();
        console.log('Export form submitted:', exportFormData);
        alert('Đã tạo phiếu xuất thành công!');
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return {
                    bg: 'bg-green-50',
                    text: 'text-green-700',
                    label: 'Hoàn thành'
                };
            case 'pending':
                return {
                    bg: 'bg-amber-50',
                    text: 'text-amber-800',
                    label: 'Chờ xử lý'
                };
            case 'cancelled':
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-600',
                    label: 'Đã hủy'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-600',
                    label: 'Chưa xác định'
                };
        }
    };

    // Get priority badge for expiry warnings
    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'KHAN_CAP':
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-600',
                    label: 'KHẨN CẤP',
                    icon: '⚠️'
                };
            case 'CANH_BAO':
                return {
                    bg: 'bg-amber-50',
                    text: 'text-amber-800',
                    label: 'CẢNH BÁO',
                    icon: '⚡'
                };
            default:
                return {
                    bg: 'bg-green-50',
                    text: 'text-green-700',
                    label: 'BÌ NH THƯỜNG',
                    icon: '✓'
                };
        }
    };

    return (
        <div className="inventory-page">
            <div className='flex flex-row justify-between w-full gap-8 mb-8'>
                {/* Create Import/Export Slip Form */}
                <div className="w-2/3 p-8 bg-white rounded-[15px] border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M234.5 5.7c13.9-5 29.1-5 43.1 0l192 68.6C495 83.4 512 107.5 512 134.6V377.4c0 27-17 51.2-42.5 60.3l-192 68.6c-13.9 5-29.1 5-43.1 0l-192-68.6C17 428.6 0 404.5 0 377.4V134.6c0-27 17-51.2 42.5-60.3l192-68.6zM256 66L82.3 128 256 190l173.7-62L256 66zm32 368.6l160-57.1v-188L288 246.6v188z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Tạo phiếu kho</h2>
                            <p className="text-sm text-gray-500">Quản lý phiếu nhập - xuất vật tư</p>
                        </div>
                    </div>

                    {/* Tab Selection */}
                    <div className="flex gap-4 mb-8 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('import')}
                            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'import'
                                    ? 'text-[#2D5016] border-b-2 border-[#2D5016]'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z" />
                                </svg>
                                <span>Phiếu nhập</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('export')}
                            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'export'
                                    ? 'text-[#2D5016] border-b-2 border-[#2D5016]'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM127 281c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l71 71L232 136c0-13.3 10.7-24 24-24s24 10.7 24 24l0 182.1 71-71c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 393c-9.4 9.4-24.6 9.4-33.9 0L127 281z" />
                                </svg>
                                <span>Phiếu xuất</span>
                            </div>
                        </button>
                    </div>

                    {/* Import Form */}
                    {activeTab === 'import' && (
                        <form onSubmit={handleImportSubmit}>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã kho <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="maKho"
                                        value={importFormData.maKho}
                                        onChange={handleImportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập mã kho"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại phiếu <span className="text-red-500">*</span></label>
                                    <select
                                        name="loaiPhieu"
                                        value={importFormData.loaiPhieu}
                                        onChange={handleImportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        required
                                    >
                                        <option value="NHAP_MUA">Nhập mua</option>
                                        <option value="NHAP_TRA_LAI">Nhập trả lại</option>
                                        <option value="NHAP_DIEU_CHINH">Nhập điều chỉnh</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã nhà cung cấp <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="maNhaCungCap"
                                        value={importFormData.maNhaCungCap}
                                        onChange={handleImportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập mã nhà cung cấp"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã thuốc/vật tư <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="maThuoc"
                                        value={importFormData.maThuoc}
                                        onChange={handleImportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập mã thuốc"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lô <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="soLo"
                                        value={importFormData.soLo}
                                        onChange={handleImportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập số lô"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Hạn sử dụng <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="hanSuDung"
                                        value={importFormData.hanSuDung}
                                        onChange={handleImportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="soLuong"
                                        value={importFormData.soLuong}
                                        onChange={handleImportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập số lượng"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Đơn giá (VNĐ) <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="donGia"
                                        value={importFormData.donGia}
                                        onChange={handleImportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập đơn giá"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">VAT (%)</label>
                                    <input
                                        type="number"
                                        name="VAT"
                                        value={importFormData.VAT}
                                        onChange={handleImportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập % VAT"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="form-group col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                                    <textarea
                                        name="ghiChu"
                                        value={importFormData.ghiChu}
                                        onChange={handleImportChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập ghi chú..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-8">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white font-bold rounded-lg hover:shadow-lg transition-all"
                                >
                                    Tạo phiếu nhập
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Export Form */}
                    {activeTab === 'export' && (
                        <form onSubmit={handleExportSubmit}>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã kho <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="maKho"
                                        value={exportFormData.maKho}
                                        onChange={handleExportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập mã kho"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại phiếu <span className="text-red-500">*</span></label>
                                    <select
                                        name="loaiPhieu"
                                        value={exportFormData.loaiPhieu}
                                        onChange={handleExportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        required
                                    >
                                        <option value="XUAT_CAP_PHAT">Xuất cấp phát</option>
                                        <option value="XUAT_HUY">Xuất hủy</option>
                                        <option value="XUAT_TRA_LAI">Xuất trả lại</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã khoa nhận <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="maKhoaNhan"
                                        value={exportFormData.maKhoaNhan}
                                        onChange={handleExportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập mã khoa nhận"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã thuốc/vật tư <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="maThuoc"
                                        value={exportFormData.maThuoc}
                                        onChange={handleExportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập mã thuốc"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lô <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="soLo"
                                        value={exportFormData.soLo}
                                        onChange={handleExportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập số lô"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="soLuong"
                                        value={exportFormData.soLuong}
                                        onChange={handleExportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập số lượng"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Đơn giá (VNĐ)</label>
                                    <input
                                        type="text"
                                        name="donGia"
                                        value={exportFormData.donGia}
                                        onChange={handleExportChange}
                                        className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập đơn giá"
                                    />
                                </div>
                                <div className="form-group col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                                    <textarea
                                        name="ghiChu"
                                        value={exportFormData.ghiChu}
                                        onChange={handleExportChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                                        placeholder="Nhập ghi chú..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-8">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white font-bold rounded-lg hover:shadow-lg transition-all"
                                >
                                    Tạo phiếu xuất
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Warning Sections */}
                <div className="w-1/3 flex flex-col gap-6">
                    {/* Stock Warning */}
                    <div className="p-6 bg-white rounded-[15px] border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Tồn kho</h3>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {stockWarnings.map((item, index) => (
                                <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold text-sm text-gray-800">{item.tenThuoc}</h4>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            Số lô: {item.soLo}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                                        <div>Tồn đầu: <span className="font-semibold">{item.tonDau.toLocaleString()}</span></div>
                                        <div>Nhập: <span className="font-semibold text-green-600">+{item.nhapTrongKy.toLocaleString()}</span></div>
                                        <div>Xuất: <span className="font-semibold text-red-600">-{item.xuatTrongKy.toLocaleString()}</span></div>
                                        <div>Tồn cuối: <span className="font-semibold">{item.tonCuoi.toLocaleString()}</span></div>
                                    </div>
                                    <div className="pt-2 border-t border-blue-200">
                                        <div className="text-xs text-gray-600">Giá trị tồn:</div>
                                        <div className="text-sm font-bold text-blue-600">{item.giaTriTon.toLocaleString()} đ</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expiry Warning */}
                    <div className="p-6 bg-white rounded-[15px] border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-600" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Sắp hết hạn</h3>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {expiryWarnings.map((item, index) => {
                                const priority = getPriorityBadge(item.mucDoUuTien);
                                return (
                                    <div key={index} className={`p-4 ${priority.bg} border ${item.mucDoUuTien === 'KHAN_CAP' ? 'border-red-300' : 'border-amber-300'} rounded-lg`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-sm text-gray-800">{item.tenThuoc}</h4>
                                            <span className={`text-xs ${priority.bg} ${priority.text} px-2 py-1 rounded font-bold flex items-center gap-1`}>
                                                <span>{priority.icon}</span>
                                                {priority.label}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-xs text-gray-600 mb-2">
                                            <div className="flex justify-between">
                                                <span>Số lô:</span>
                                                <span className="font-semibold">{item.soLo}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>HSD:</span>
                                                <span className="font-semibold">{item.hanSuDung}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Còn lại:</span>
                                                <span className={`font-bold ${item.soNgayConLai < 90 ? 'text-red-600' : 'text-amber-600'}`}>
                                                    {item.soNgayConLai} ngày
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Số lượng tồn:</span>
                                                <span className="font-semibold">{item.soLuongTon.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory List Table */}
            <div className="bg-white rounded-[15px] border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Danh sách phiếu kho</h3>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all">
                                <svg className="w-4 h-4 inline mr-2" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                                </svg>
                                Tìm kiếm
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all">
                                <svg className="w-4 h-4 inline mr-2" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
                                </svg>
                                Lọc
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase">Mã phiếu</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase">Loại phiếu</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase">Kho</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase">Đối tượng</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase">Ngày tạo</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase">Tổng tiền</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase">Trạng thái</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase">Ghi chú</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockInventory.map((item, index) => {
                                const status = getStatusBadge(item.trangThai);
                                return (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-semibold text-gray-800">{item.id}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {item.loaiPhieu.includes('NHAP') ? (
                                                    <svg className="w-4 h-4 text-green-600" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4 text-red-600" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM127 281c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l71 71L232 136c0-13.3 10.7-24 24-24s24 10.7 24 24l0 182.1 71-71c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 393c-9.4 9.4-24.6 9.4-33.9 0L127 281z" />
                                                    </svg>
                                                )}
                                                <span className="text-sm text-gray-800">
                                                    {item.loaiPhieu === 'NHAP_MUA' ? 'Nhập mua' :
                                                        item.loaiPhieu === 'XUAT_CAP_PHAT' ? 'Xuất cấp phát' :
                                                            item.loaiPhieu}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-800">{item.tenKho}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-800">
                                                {item.tenNhaCungCap || item.tenKhoaNhan || '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-800">{item.ngayTao}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-semibold text-gray-800">{item.tongTien} đ</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className={`${status.bg} ${status.text} rounded-md px-3 py-1 inline-block`}>
                                                <span className="text-xs font-bold">{status.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-800">{item.ghiChu}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="bg-blue-50 text-blue-600 rounded-md p-1.5 hover:bg-blue-100 transition-all">
                                                    <i className="fas fa-eye text-xs"></i>
                                                </button>
                                                <button className="bg-amber-50 text-amber-600 rounded-md p-1.5 hover:bg-amber-100 transition-all">
                                                    <i className="fas fa-edit text-xs"></i>
                                                </button>
                                                <button className="bg-red-50 text-red-600 rounded-md p-1.5 hover:bg-red-100 transition-all">
                                                    <i className="fas fa-trash text-xs"></i>
                                                </button>
                                            </div>
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

export default InventoryPage;
