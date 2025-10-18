import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DetailSettlements = ({ isOpen, onClose, settlement }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedSettlement, setEditedSettlement] = useState({
        actualAmount: settlement?.actualAmount || '',
        reason: settlement?.reason || '',
        notes: settlement?.notes || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Format currency for actualAmount
        if (name === 'actualAmount') {
            const numericValue = value.replace(/[^0-9]/g, '');
            const formattedValue = numericValue ?
                new Intl.NumberFormat('vi-VN').format(parseInt(numericValue)) : '';
            setEditedSettlement({
                ...editedSettlement,
                [name]: formattedValue
            });
        } else {
            setEditedSettlement({
                ...editedSettlement,
                [name]: value
            });
        }
    };

    const handleUpdate = () => {
        console.log('Updated settlement:', editedSettlement);
        // Thực hiện logic cập nhật quyết toán ở đây
        setIsEditing(false);
    };

    const handleApprove = () => {
        console.log('Phê duyệt quyết toán:', settlement);
        // Thực hiện logic phê duyệt quyết toán ở đây
        onClose();
    };

    if (!isOpen || !settlement) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 60 }}>
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black opacity-70"
                onClick={onClose}
            ></div>
            <div className="relative bg-white rounded-[15px] w-[800px] max-h-[810px] shadow-xl z-10 flex flex-col">
                {/* Modal Header */}
                <div className="modal-header bg-gradient-to-br from-[#2D5016] to-[#1A2F0C] h-20 flex items-center justify-between px-8 text-white flex-shrink-0 rounded-t-[15px]">
                    <div className="flex items-center gap-[30px]">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM80 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm16 96H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm0 32v64H288V256H96zM240 416h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">Chi tiết quyết toán</h2>
                    </div>
                    <button
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white hover:bg-opacity-20"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                        onClick={onClose}
                    >
                        <i className="fas fa-times text-white text-sm"></i>
                    </button>
                </div>

                <div className="modal-body p-8 overflow-y-auto flex-1">
                    {/* Thông tin quyết toán */}
                    <div className="info-grid grid grid-cols-2 gap-x-16 gap-y-8 mb-8">
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Mã quyết toán</div>
                            <div className="text-sm text-gray-800">{settlement.id}</div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Mã dự toán</div>
                            <div className="text-sm text-gray-800">{settlement.estimateCode}</div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Số tiền thực tế</div>
                            <div className="text-sm text-gray-800">{settlement.actualAmount} đ</div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Chênh lệch</div>
                            <div className={`text-sm font-bold ${settlement.differenceType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                {settlement.difference} đ
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Ngày quyết toán</div>
                            <div className="text-sm text-gray-800">{settlement.date}</div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Trạng thái</div>
                            <div>
                                {settlement.status === 'rejected' && (
                                    <div className="bg-red-50 text-red-600 rounded-md px-3 py-1 inline-block">
                                        <span className="text-xs font-bold">TỪ CHỐI</span>
                                    </div>
                                )}
                                {settlement.status === 'approved' && (
                                    <div className="bg-green-50 text-green-700 rounded-md px-3 py-1 inline-block">
                                        <span className="text-xs font-bold">ĐÃ DUYỆT</span>
                                    </div>
                                )}
                                {settlement.status === 'pending' && (
                                    <div className="bg-amber-50 text-amber-800 rounded-md px-3 py-1 inline-block">
                                        <span className="text-xs font-bold">CHỜ DUYỆT</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Phần chỉnh sửa */}
                    <div className="edit-section mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="text-gray-800">
                                <svg className="w-4 h-4 text-gray-800" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-gray-800">Chỉnh sửa thông tin</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="form-group">
                                <label className="block text-sm text-gray-600 mb-2">Số tiền thực tế (VNĐ)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="actualAmount"
                                        value={editedSettlement.actualAmount}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full h-[43px] px-4 border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                                        placeholder="480,000,000"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        VNĐ
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="block text-sm text-gray-600 mb-2">Lý do chênh lệch</label>
                                <textarea
                                    name="reason"
                                    value={editedSettlement.reason}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none bg-white disabled:bg-gray-50"
                                    placeholder="Nhập lý do chênh lệch..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="block text-sm text-gray-600 mb-2">Ghi chú</label>
                                <textarea
                                    name="notes"
                                    value={editedSettlement.notes}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none bg-white disabled:bg-gray-50"
                                    placeholder="Nhập ghi chú..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer bg-gray-50 p-6 border-t border-gray-200 flex justify-end flex-shrink-0 rounded-b-[15px]">
                    <div className="flex gap-4">
                        {settlement.status === 'pending' && (
                            <>
                                {isEditing ? (
                                    <button
                                        onClick={handleUpdate}
                                        className="w-[136px] h-[47px] bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold rounded-lg flex items-center justify-center"
                                    >
                                        <div className="flex items-center gap-[8px]">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                            </svg>
                                            <span>Cập nhật</span>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-[136px] h-[47px] bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold rounded-lg flex items-center justify-center"
                                    >
                                        <div className="flex items-center gap-[8px]">
                                            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                                            </svg>
                                            <span>Chỉnh sửa</span>
                                        </div>
                                    </button>
                                )}

                                <button
                                    onClick={handleApprove}
                                    className="w-[135px] h-[47px] bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white font-bold rounded-lg flex items-center justify-center"
                                >
                                    <span>Phê Duyệt</span>
                                </button>
                            </>
                        )}

                        {settlement.status !== 'pending' && (
                            <button
                                onClick={onClose}
                                className="w-[124px] h-[47px] bg-gradient-to-br from-gray-500 to-gray-600 text-white font-bold rounded-lg flex items-center justify-center"
                            >
                                <span>Đóng</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

DetailSettlements.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    settlement: PropTypes.shape({
        id: PropTypes.string,
        estimateCode: PropTypes.string,
        actualAmount: PropTypes.string,
        difference: PropTypes.string,
        differenceType: PropTypes.string,
        date: PropTypes.string,
        status: PropTypes.string,
        reason: PropTypes.string,
        notes: PropTypes.string
    })
};

export default DetailSettlements;
