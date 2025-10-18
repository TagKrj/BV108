import React, { useState } from 'react';

const DetailEstimate = ({ isOpen, onClose, estimate }) => {
    const [editableAmount, setEditableAmount] = useState('');
    const [editableNotes, setEditableNotes] = useState('');

    // Update editable fields when estimate changes
    React.useEffect(() => {
        if (estimate) {
            setEditableAmount(estimate.amount || '');
            setEditableNotes(estimate.notes || '');
        }
    }, [estimate]);

    if (!isOpen || !estimate) return null;

    // Get status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case 'rejected':
                return { bg: 'bg-red-50', text: 'text-red-600', label: 'TỪ CHỐI' };
            case 'approved':
                return { bg: 'bg-green-50', text: 'text-green-700', label: 'ĐÃ DUYỆT' };
            case 'pending':
                return { bg: 'bg-amber-50', text: 'text-amber-800', label: 'CHỜ DUYỆT' };
            default:
                return { bg: 'bg-green-50', text: 'text-green-700', label: 'HOÀN THÀNH' };
        }
    };

    const statusBadge = getStatusBadge(estimate.status);

    // Get item type badge styling
    const getItemTypeBadge = (itemType) => {
        return {
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            label: itemType?.toUpperCase() || 'THUỐC'
        };
    };

    const itemTypeBadge = getItemTypeBadge(estimate.itemType);

    // Handle amount input change
    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        const formattedValue = value ? new Intl.NumberFormat('vi-VN').format(parseInt(value)) : '';
        setEditableAmount(formattedValue);
    };

    return (
        <>
            {/* Modal Wrapper */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Overlay - Click để đóng */}
                <div
                    className="absolute inset-0 bg-black opacity-60"
                    onClick={onClose}
                ></div>

                {/* Modal Container */}
                <div className="relative bg-white rounded-[15px] w-[800px] max-h-[90vh] overflow-hidden shadow-xl">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-br from-[#2D5016] to-[#1A2F0C] px-8 py-6 relative">
                        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-file-invoice text-white text-xl"></i>
                                <h2 className="text-xl font-bold text-white">Chi tiết dự toán</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <i className="fas fa-times text-white text-sm"></i>
                            </button>
                        </div>
                    </div>

                    {/* Modal Content - Scrollable */}
                    <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-8">
                        {/* Warning Message */}
                        <div className="flex items-center gap-3 mb-6 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <i className="fas fa-exclamation-triangle text-amber-600 text-sm"></i>
                            <span className="text-xs text-amber-600">*Chỉ được sửa số tiền dự toán và mô tả</span>
                        </div>

                        {/* Section 1: Thông tin dự toán */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <i className="fas fa-info-circle text-[#2D5016] text-base"></i>
                                <h3 className="text-base font-bold text-[#1F2937]">Thông tin dự toán</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Mã dự toán */}
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">MÃ DỰ TOÁN</label>
                                        <div className="bg-[#F3F4F6] rounded-md px-2 py-2">
                                            <span className="text-xs text-[#374151]">{estimate.id}</span>
                                        </div>
                                    </div>

                                    {/* Hạng mục */}
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">HẠNG MỤC</label>
                                        <span className="text-sm text-[#1F2937]">{estimate.item}</span>
                                    </div>

                                    {/* Loại hạng mục */}
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">LOẠI HẠNG MỤC</label>
                                        <div className={`${itemTypeBadge.bg} ${itemTypeBadge.text} rounded-md px-3 py-1 inline-block`}>
                                            <span className="text-xs font-medium">{itemTypeBadge.label}</span>
                                        </div>
                                    </div>

                                    {/* Đơn vị thực hiện */}
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">ĐƠN VỊ THỰC HIỆN</label>
                                        <span className="text-sm text-[#1F2937]">{estimate.executingUnit}</span>
                                    </div>

                                    {/* Người phụ trách */}
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">NGƯỜI PHỤ TRÁCH</label>
                                        <span className="text-sm text-[#1F2937]">{estimate.manager}</span>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Số tiền dự toán */}
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">SỐ TIỀN DỰ TOÁN</label>
                                        <span className="text-xl font-bold text-[#2D5016]">{estimate.amount} ₫</span>
                                    </div>

                                    {/* Trạng thái */}
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">TRẠNG THÁI</label>
                                        <div className={`${statusBadge.bg} ${statusBadge.text} rounded-md px-3 py-1 inline-block`}>
                                            <span className="text-xs font-medium">{statusBadge.label}</span>
                                        </div>
                                    </div>

                                    {/* Ngày bắt đầu */}
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">NGÀY BẮT ĐẦU</label>
                                        <span className="text-sm text-[#1F2937]">{estimate.startDate}</span>
                                    </div>

                                    {/* Ngày kết thúc */}
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">NGÀY KẾT THÚC</label>
                                        <span className="text-sm text-[#1F2937]">{estimate.endDate}</span>
                                    </div>

                                    {/* Ngày tạo */}
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">NGÀY TẠO</label>
                                        <span className="text-sm text-[#1F2937]">{estimate.createdAt}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Thông tin ngân sách liên quan */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <i className="fas fa-wallet text-[#2D5016] text-base"></i>
                                <h3 className="text-base font-bold text-[#1F2937]">Thông tin ngân sách liên quan</h3>
                            </div>

                            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-5">
                                <h4 className="text-sm font-bold text-[#374151] mb-4">Ngân sách Quý 1/2025 - Khoa Nội</h4>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">MÃ NGÂN SÁCH</label>
                                        <div className="bg-[#F3F4F6] rounded-md px-2 py-2">
                                            <span className="text-xs text-[#374151]">ad784e1d-c203-4ab5-ac7f-c90509595822</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">QUÝ/NĂM</label>
                                        <span className="text-sm text-[#1F2937]">Q1/2025 - Khoa Nội</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">TỔNG NGÂN SÁCH</label>
                                        <span className="text-sm text-[#1F2937]">5,000,000,000 ₫</span>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">TRẠNG THÁI</label>
                                        <div className="bg-green-50 text-green-700 rounded-md px-3 py-1 inline-block">
                                            <span className="text-xs font-medium">ĐÃ DUYỆT</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">NGƯỜI DUYỆT</label>
                                        <span className="text-sm text-[#1F2937]">giamdoc</span>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">NGÀY DUYỆT</label>
                                        <span className="text-sm text-[#1F2937]">07/10/2025 15:31:57</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Chỉnh sửa thông tin */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <i className="fas fa-edit text-[#2D5016] text-base"></i>
                                <h3 className="text-base font-bold text-[#1F2937]">Chỉnh sửa thông tin</h3>
                            </div>

                            <div className="space-y-4">
                                {/* Số tiền dự toán */}
                                <div>
                                    <label className="block text-sm text-[#374151] mb-2">Số tiền dự toán</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={editableAmount}
                                            onChange={handleAmountChange}
                                            className="w-full h-[45px] px-4 pr-12 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent"
                                            placeholder="Nhập số tiền dự toán"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#6B7280] font-medium">₫</span>
                                    </div>
                                </div>

                                {/* Mô tả */}
                                <div>
                                    <label className="block text-sm text-[#374151] mb-2">Mô tả</label>
                                    <textarea
                                        value={editableNotes}
                                        onChange={(e) => setEditableNotes(e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] focus:border-transparent resize-none"
                                        placeholder="Nhập mô tả..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Thông tin quyết toán */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <i className="fas fa-check-circle text-[#2D5016] text-base"></i>
                                <h3 className="text-base font-bold text-[#1F2937]">Thông tin quyết toán</h3>
                            </div>

                            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <i className="fas fa-check-circle text-[#065F46] text-sm"></i>
                                    <h4 className="text-sm font-bold text-[#065F46]">Quyết toán đã duyệt</h4>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">SỐ TIỀN THỰC TẾ</label>
                                        <span className="text-sm text-[#1F2937]">480,000,000 ₫</span>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">CHÊNH LỆCH</label>
                                        <span className="text-sm font-bold text-[#059669]">-20,000,000 ₫</span>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">TRẠNG THÁI</label>
                                        <div className="bg-green-50 text-green-700 rounded-md px-3 py-1 inline-block">
                                            <span className="text-xs font-medium">ĐÃ DUYỆT</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">NGƯỜI DUYỆT</label>
                                        <span className="text-sm text-[#1F2937]">giamdoc</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">LÝ DO CHÊNH LỆCH</label>
                                        <span className="text-sm text-[#1F2937]">Tiết kiệm chi phí, đàm phán giá tốt với nhà cung cấp</span>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#6B7280] mb-2">GHI CHÚ</label>
                                        <span className="text-sm text-[#1F2937]">Đã kiểm tra và phê duyệt quyết toán</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-[#F9FAFB] border-t border-[#E5E7EB] px-8 py-5 flex justify-end gap-3">
                        <button className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-normal rounded-lg flex items-center gap-2 transition-colors">
                            <i className="fas fa-check text-sm"></i>
                            <span className="text-sm">Phê duyệt</span>
                        </button>
                        <button className="px-5 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white font-normal rounded-lg flex items-center gap-2 transition-colors">
                            <i className="fas fa-times text-sm"></i>
                            <span className="text-sm">Từ chối</span>
                        </button>
                        <button className="px-5 py-2.5 bg-[#2D5016] hover:bg-[#1A2F0C] text-white font-normal rounded-lg flex items-center gap-2 transition-colors">
                            <i className="fas fa-save text-sm"></i>
                            <span className="text-sm">Cập nhật</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailEstimate;
