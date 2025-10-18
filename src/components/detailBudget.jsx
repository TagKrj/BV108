import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DetailBudget = ({ isOpen, onClose, budget }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedBudget, setEditedBudget] = useState({
        totalBudget: budget?.totalBudget || '',
        notes: budget?.notes || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedBudget({
            ...editedBudget,
            [name]: value
        });
    };

    const handleUpdate = () => {
        console.log('Updated budget:', editedBudget);
        // Thực hiện logic cập nhật ngân sách ở đây
        setIsEditing(false);
    };

    const handleReject = () => {
        console.log('Từ chối ngân sách:', budget);
        // Thực hiện logic từ chối ngân sách ở đây
        onClose();
    };

    const handleApprove = () => {
        console.log('Phê duyệt ngân sách:', budget);
        // Thực hiện logic phê duyệt ngân sách ở đây
        onClose();
    };

    if (!isOpen || !budget) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 60 }}>
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black opacity-70"
                onClick={onClose}
            ></div>
            <div className="relative bg-white rounded-[15px] w-[800px] max-h-[810px] overflow-hidden shadow-xl z-10">
                {/* Modal Header */}
                <div className="modal-header bg-gradient-to-br from-[#2D5016] to-[#1A2F0C] h-20 flex items-center justify-between px-8 text-white">
                    <div className="flex items-center gap-[30px]">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V336zm0-96V208c0-1.8-.1-3.5-.2-5.3c20 4.8 37.8 11.1 52.4 18.5c27.3 13.8 43.8 31.6 43.8 50.9v35.6c-12.5 10.3-27.6 18.7-43.9 25.5c-22 9.1-47.9 16.1-76.2 20.5c13.5-13.5 24.1-31.6 24.1-53.5zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5V432c0 44.2-86 80-192 80S0 476.2 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">Chi tiết ngân sách</h2>
                    </div>
                    <button
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-white hover:bg-opacity-20"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                        onClick={onClose}
                    >
                        <i className="fas fa-times text-white text-sm"></i>
                    </button>
                </div>

                <div className="modal-body p-8">
                    {/* Thông tin ngân sách */}
                    <div className="info-grid grid grid-cols-2 gap-x-16 gap-y-8 mb-8">
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Mã ngân sách</div>
                            <div className="text-sm text-gray-800">{budget.id}</div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Quý/Năm</div>
                            <div className="text-sm text-gray-800">Q{budget.quarter}/{budget.year}</div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Đơn vị</div>
                            <div className="text-sm text-gray-800">{budget.unit}</div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Trạng thái</div>
                            <div>
                                {budget.status === 'rejected' && (
                                    <div className="bg-red-50 text-red-600 rounded-md px-3 py-1 inline-block">
                                        <span className="text-xs">TỪ CHỐI</span>
                                    </div>
                                )}
                                {budget.status === 'approved' && (
                                    <div className="bg-green-50 text-green-700 rounded-md px-3 py-1 inline-block">
                                        <span className="text-xs">ĐÃ DUYỆT</span>
                                    </div>
                                )}
                                {budget.status === 'pending' && (
                                    <div className="bg-amber-50 text-amber-800 rounded-md px-3 py-1 inline-block">
                                        <span className="text-xs">CHỜ DUYỆT</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Người tạo</div>
                            <div className="text-sm text-gray-800">{budget.createdBy}</div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Người duyệt</div>
                            <div className="text-sm text-gray-800">{budget.approvedBy || '-'}</div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Ngày tạo</div>
                            <div className="text-sm text-gray-800">{budget.createdAt}</div>
                        </div>
                        <div className="info-item">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">Ngày duyệt</div>
                            <div className="text-sm text-gray-800">{budget.approvedAt || '-'}</div>
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

                        <div className="grid grid-cols-2 gap-8">
                            <div className="form-group">
                                <label className="block text-sm text-gray-600 mb-2">Tổng ngân sách</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="totalBudget"
                                        value={editedBudget.totalBudget}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full h-[43px] px-4 border border-gray-200 rounded-lg bg-white"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        VNĐ
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="block text-sm text-gray-600 mb-2">Ghi chú</label>
                                <textarea
                                    name="notes"
                                    value={editedBudget.notes}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
                    <div className="flex gap-4">
                        {budget.status === 'pending' && (
                            <>
                                <button
                                    onClick={handleReject}
                                    className="w-[124px] h-[47px] bg-gradient-to-br from-red-600 to-red-700 text-white font-bold rounded-lg flex items-center justify-center"
                                >
                                    <div className="flex items-center gap-[8px]">
                                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                        </svg>
                                        <span>Từ chối</span>
                                    </div>
                                </button>

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

                        {budget.status !== 'pending' && (
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

DetailBudget.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    budget: PropTypes.shape({
        id: PropTypes.string,
        quarter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        unit: PropTypes.string,
        totalBudget: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        notes: PropTypes.string,
        status: PropTypes.string,
        createdBy: PropTypes.string,
        createdAt: PropTypes.string,
        approvedBy: PropTypes.string,
        approvedAt: PropTypes.string
    })
};

export default DetailBudget;
