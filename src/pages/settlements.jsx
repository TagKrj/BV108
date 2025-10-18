import React, { useState } from 'react';
import DetailSettlements from '../components/detailSettlements';

const SettlementsPage = () => {
    // State for detail popup
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedSettlement, setSelectedSettlement] = useState(null);
    // Mock data for warning items
    const warningItems = [
        {
            id: 1,
            title: 'Thiết bị y tế',
            badge: 'CAO: 135%',
            badgeColor: 'bg-red-50 text-red-600',
            estimate: '100M',
            actual: '135M',
            difference: '+35M',
            differenceLabel: 'Vượt:',
            progress: 135,
            progressColor: 'from-[#DC2626] to-[#EF4444]',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-600'
        },
        {
            id: 2,
            title: 'Bảo trì máy móc',
            badge: 'TRUNG BÌNH: 112%',
            badgeColor: 'bg-amber-50 text-amber-800',
            estimate: '50M',
            actual: '56M',
            difference: '+6M',
            differenceLabel: 'Vượt:',
            progress: 112,
            progressColor: 'from-[#F59E0B] to-[#FBBF24]',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-600'
        },
        {
            id: 3,
            title: 'Thuốc kháng sinh',
            badge: 'AN TOÀN: 96%',
            badgeColor: 'bg-green-50 text-green-700',
            estimate: '500M',
            actual: '480M',
            difference: '-20M',
            differenceLabel: 'Tiết kiệm:',
            progress: 96,
            progressColor: 'from-[#10B981] to-[#34D399]',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-600'
        }
    ];

    // Mock data for settlements table
    const mockSettlements = [
        {
            id: 'QT2024001',
            estimateCode: 'DT001',
            actualAmount: '480,000,000',
            difference: '-20,000,000',
            differenceType: 'positive',
            date: '31/03/2024',
            status: 'approved',
            reason: 'Tiết kiệm chi phí'
        },
        {
            id: 'QT2024002',
            estimateCode: 'DT002',
            actualAmount: '135,000,000',
            difference: '+35,000,000',
            differenceType: 'negative',
            date: '30/03/2024',
            status: 'pending',
            reason: 'Nâng cấp thiết bị'
        },
        {
            id: 'QT2024003',
            estimateCode: 'DT003',
            actualAmount: '56,000,000',
            difference: '+6,000,000',
            differenceType: 'negative',
            date: '28/03/2024',
            status: 'approved',
            reason: 'Sửa chữa ngoài kế hoạch'
        },
        {
            id: 'QT2024004',
            estimateCode: 'DT004',
            actualAmount: '72,000,000',
            difference: '-8,000,000',
            differenceType: 'positive',
            date: '25/03/2024',
            status: 'approved',
            reason: 'Mua sỉ số lượng lớn'
        },
        {
            id: 'QT2024005',
            estimateCode: 'DT005',
            actualAmount: '45,000,000',
            difference: '-5,000,000',
            differenceType: 'positive',
            date: '20/03/2024',
            status: 'rejected',
            reason: 'Không đủ chứng từ'
        }
    ];

    // Form state
    const [formData, setFormData] = useState({
        estimateCode: '',
        actualAmount: '',
        settlementDate: '',
        reason: '',
        notes: '',
        creator: ''
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Format currency for actualAmount field
        if (name === 'actualAmount') {
            const numericValue = value.replace(/[^0-9]/g, '');
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
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Đã tạo quyết toán thành công!');
    };

    // Handle view detail
    const handleViewDetail = (settlementId) => {
        const settlement = mockSettlements.find(s => s.id === settlementId);
        if (settlement) {
            setSelectedSettlement(settlement);
            setIsDetailOpen(true);
        }
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return {
                    bg: 'bg-green-50',
                    text: 'text-green-700',
                    label: 'Đã duyệt'
                };
            case 'pending':
                return {
                    bg: 'bg-amber-50',
                    text: 'text-amber-800',
                    label: 'Chờ duyệt'
                };
            case 'rejected':
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-600',
                    label: 'Từ chối'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-600',
                    label: 'Chưa xác định'
                };
        }
    };

    return (
        <div className="settlements-page">
            <div className='flex flex-row justify-between w-full gap-8 mb-8'>
                {/* Create Settlement Form */}
                <form onSubmit={handleSubmit} className="w-2/3 p-8 bg-white rounded-[15px] border border-gray-200 shadow-sm">
                    {/* Card Title */}
                    <div className="card-title mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="fas fa-file-invoice-dollar text-[#2D5016] text-xl"></i>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Tạo quyết toán mới
                            </h2>
                        </div>
                    </div>

                    <div className="flex justify-between gap-8">
                        {/* Left Column */}
                        <div className="form-layout w-1/2">
                            {/* Estimate Code */}
                            <div className="form-group mb-3">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Mã dự toán
                                </label>
                                <select
                                    name="estimateCode"
                                    value={formData.estimateCode}
                                    onChange={handleChange}
                                    className="w-full h-[43px] px-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-white"
                                >
                                    <option value="">Chọn mã dự toán</option>
                                    <option value="DT001">DT001</option>
                                    <option value="DT002">DT002</option>
                                    <option value="DT003">DT003</option>
                                </select>
                            </div>

                            {/* Actual Amount */}
                            <div className="form-group mb-3">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Số tiền thực tế (VNĐ)
                                </label>
                                <input
                                    type="text"
                                    name="actualAmount"
                                    value={formData.actualAmount}
                                    onChange={handleChange}
                                    className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                                    placeholder="480,000,000"
                                />
                            </div>

                            {/* Notes */}
                            <div className="form-group mb-3">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Ghi chú
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent resize-none"
                                    placeholder="Nhập ghi chú..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="form-layout w-1/2">

                            {/* Creator */}
                            <div className="form-group mb-3">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Người lập
                                </label>
                                <input
                                    type="text"
                                    name="creator"
                                    value={formData.creator}
                                    onChange={handleChange}
                                    className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent bg-gray-50"
                                    placeholder="ketoan"
                                />
                            </div>

                            {/* Settlement Date */}
                            <div className="form-group mb-3">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Ngày quyết toán
                                </label>
                                <input
                                    type="date"
                                    name="settlementDate"
                                    value={formData.settlementDate}
                                    onChange={handleChange}
                                    className="w-full h-[43px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                                />
                            </div>

                            {/* Reason */}
                            <div className="form-group mb-3">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Lý do chênh lệch
                                </label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent resize-none"
                                    placeholder="Nhập lý do chênh lệch..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Preview Box */}
                    <div className="mt-5 p-6 bg-gradient-to-br from-[#F0F9F4] to-[#E8F5E1] border-2 border-[#2D5016] rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-sm text-gray-700">
                                <span className="font-medium">Dự toán:</span>
                            </div>
                            <div className="text-sm font-bold text-gray-800">
                                500,000,000 VNĐ
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-sm text-gray-700">
                                <span className="font-medium">Thực tế:</span>
                            </div>
                            <div className="text-sm font-bold text-gray-800">
                                480,000,000 VNĐ
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-[#2D5016]">
                            <div className="text-base font-bold text-gray-700">
                                Chênh lệch:
                            </div>
                            <div className="text-base font-bold text-green-600">
                                -20,000,000 VNĐ (Tiết kiệm 4.00%)
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
                            <span>Tạo quyết toán</span>
                        </button>
                    </div>
                </form>

                {/* Warning Alerts */}
                <div className="w-1/3 p-8 bg-white rounded-[15px] border border-gray-200 shadow-sm">
                    <div className="card-title mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="fas fa-exclamation-triangle text-[#2D5016] text-xl"></i>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Cảnh báo vượt chi
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {warningItems.map((item) => (
                            <div key={item.id} className={`${item.bgColor} border-l-4 ${item.borderColor} rounded-lg p-6`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-gray-800">{item.title}</h3>
                                    <div className={`${item.badgeColor} px-3 py-1 rounded-md`}>
                                        <span className="text-xs font-bold">{item.badge}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mb-4">
                                    <div>
                                        <span>Dự toán: </span>
                                        <strong className="text-gray-800">{item.estimate}</strong>
                                    </div>
                                    <div>
                                        <span>Thực tế: </span>
                                        <strong className="text-gray-800">{item.actual}</strong>
                                    </div>
                                    <div>
                                        <span>{item.differenceLabel} </span>
                                        <strong className="text-gray-800">{item.difference}</strong>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`bg-gradient-to-r ${item.progressColor} h-2.5 rounded-full`}
                                        style={{ width: `${Math.min(item.progress, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Settlements List */}
            <div className="list-card bg-white rounded-[15px] border border-gray-200 shadow-sm">
                {/* Card Header */}
                <div className="list-header flex items-center justify-between px-8 py-6 border-b border-gray-100">
                    <div className="card-title flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className="fas fa-list text-[#2D5016] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Danh sách quyết toán
                        </h2>
                    </div>
                </div>

                {/* Data Table */}
                <div className="data-table overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Mã quyết toán
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Mã dự toán
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Số tiền thực tế
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Chênh lệch
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Ngày quyết toán
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Trạng thái
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Lý do
                                </th>
                                <th className="px-4 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {mockSettlements.map((settlement) => {
                                const statusBadge = getStatusBadge(settlement.status);

                                return (
                                    <tr key={settlement.id} className="border-t border-gray-100">
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-800">{settlement.id}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-800">{settlement.estimateCode}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-800">{settlement.actualAmount} đ</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`text-sm font-bold ${settlement.differenceType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                                {settlement.difference} đ
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-800">{settlement.date}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className={`${statusBadge.bg} ${statusBadge.text} rounded-md px-3 py-1 inline-flex items-center gap-1.5`}>
                                                <i className={`fas fa-check-circle text-xs ${statusBadge.text}`}></i>
                                                <span className="text-xs font-bold">{statusBadge.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-800">{settlement.reason}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="bg-blue-50 text-blue-600 rounded-md p-1.5"
                                                    onClick={() => handleViewDetail(settlement.id)}
                                                >
                                                    <i className="fas fa-eye text-xs"></i>
                                                </button>
                                                <button className="bg-red-50 text-red-600 rounded-md p-1.5">
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

            {/* Detail Settlements Popup */}
            <DetailSettlements
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                settlement={selectedSettlement}
            />
        </div>
    );
};

export default SettlementsPage;
