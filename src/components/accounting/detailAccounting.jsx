import React from 'react';
import PropTypes from 'prop-types';

const DetailAccountingPopup = ({ isOpen, onClose, receiptData, onAdvanceClick, onCompleteClick, onPaymentClick }) => {
    if (!isOpen) return null;

    // Handler for advance button click
    const handleAdvanceClick = () => {
        // Không đóng popup hiện tại, chỉ mở popup tạm ứng đè lên
        if (onAdvanceClick) {
            onAdvanceClick(receiptData);
        }
    };

    // Handler for complete button click
    const handleCompleteClick = () => {
        // Không đóng popup hiện tại, chỉ mở popup hoàn ứng đè lên
        if (onCompleteClick) {
            onCompleteClick(receiptData);
        }
    };

    // Handler for payment button click
    const handlePaymentClick = () => {
        // Không đóng popup hiện tại, chỉ mở popup thanh toán đè lên
        if (onPaymentClick) {
            onPaymentClick(receiptData);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black opacity-70"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-[15px] shadow-xl max-h-[90vh] w-[1000px] max-w-[95%] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="modal-header bg-gradient-to-br from-[#2D5016] to-[#1A2F0C] px-8 py-6 text-white flex justify-between items-center flex-shrink-0">
                    <div className="modal-title flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <i className="fas fa-file-invoice text-[#A7D68A] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-bold">
                            Chi tiết biên lai {receiptData?.code || 'VP2025000008'}
                        </h2>
                    </div>
                    <button
                        className="w-8 h-8 rounded-[5px] flex items-center justify-center transition-all hover:bg-white hover:bg-opacity-20 cursor-pointer"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                        onClick={onClose}
                    >
                        <i className="fas fa-times text-white"></i>
                    </button>
                </div>

                <div className="modal-body p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Thông tin chung */}
                        <div className="info-section bg-[#F9FAFB] border border-[#E5E7EB] rounded-[15px] p-6">
                            <div className="section-title flex items-center gap-3 mb-5">
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <i className="fas fa-info-circle text-[#2D5016]"></i>
                                </div>
                                <h3 className="text-base font-semibold text-[#1F2937]">Thông tin chung</h3>
                            </div>

                            <div className="info-grid grid grid-cols-1 gap-5">
                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Mã viện phí</div>
                                    <div className=" px-2 py-1 rounded mt-1">
                                        <span className="font-bold text-gray-700">{receiptData?.code || 'VP2025000008'}</span>
                                    </div>
                                </div>

                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Mã hồ sơ</div>
                                    <div className=" px-2 py-1 rounded mt-1">
                                        <span className="font-bold text-gray-700">{receiptData?.recordCode || 'HS001'}</span>
                                    </div>
                                </div>

                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Ngày tạo</div>
                                    <div className="font-semibold text-gray-800 mt-1">
                                        {receiptData?.createdDate || '07/10/2025 - 16:18'}
                                    </div>
                                </div>

                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Người thu</div>
                                    <div className="font-semibold text-gray-800 mt-1">
                                        {receiptData?.collector || 'admin'}
                                    </div>
                                </div>

                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Tổng tiền</div>
                                    <div className="bg-green-50 border border-green-200 px-3 py-1 rounded mt-1 inline-block">
                                        <span className="font-bold text-green-600">
                                            {receiptData?.totalAmount?.toLocaleString() || '200,000'} VNĐ
                                        </span>
                                    </div>
                                </div>

                                {/* <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Tiền BN trả</div>
                                    <div className="font-bold text-green-600 mt-1">
                                        {receiptData?.patientPaid?.toLocaleString() || '200,000'} VNĐ
                                    </div>
                                </div> */}

                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Tỷ lệ bảo hiểm</div>
                                    <div className="font-semibold text-gray-800 mt-1">
                                        {receiptData?.insuranceRate || '0%'}
                                    </div>
                                </div>

                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Tiền bảo hiểm</div>
                                    <div className="font-bold text-green-600 mt-1">
                                        {receiptData?.insuranceAmount?.toLocaleString() || '0'} VNĐ
                                    </div>
                                </div>

                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Đã tạm ứng</div>
                                    <div className="font-bold text-blue-600 mt-1">
                                        {(() => {
                                            const tongTamUng = receiptData?.tamUngs?.reduce((sum, tu) => {
                                                // Chỉ tính các tạm ứng không phải loại hoàn ứng (loaiTamUng !== 3 hoặc trangThai === 0)
                                                if (tu.loaiTamUng === 3 && tu.trangThai === 3) return sum;
                                                return sum + parseFloat(tu.soTien || 0);
                                            }, 0) || 0;
                                            return tongTamUng.toLocaleString();
                                        })()} VNĐ
                                    </div>
                                </div>

                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Đã hoàn ứng</div>
                                    <div className="font-bold text-orange-600 mt-1">
                                        {parseFloat(receiptData?.tongTienHoanUng || 0).toLocaleString()} VNĐ
                                    </div>
                                </div>

                                {(() => {
                                    const tongTien = parseFloat(receiptData?.tongTien || 0);
                                    const tienBaoHiem = parseFloat(receiptData?.tienBaoHiem || 0);
                                    const tongTamUng = receiptData?.tamUngs?.reduce((sum, tu) => {
                                        if (tu.loaiTamUng === 3 && tu.trangThai === 3) return sum;
                                        return sum + parseFloat(tu.soTien || 0);
                                    }, 0) || 0;
                                    const tongHoanUng = parseFloat(receiptData?.tongTienHoanUng || 0);
                                    const conPhaiTra = tongTien - tienBaoHiem - tongTamUng + tongHoanUng;

                                    return (
                                        <div className={`info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between ${conPhaiTra < 0 ? 'bg-orange-50' : conPhaiTra > 0 ? 'bg-red-50' : 'bg-green-50'
                                            } -mx-3 px-3 py-2 rounded`}>
                                            <div className="text-sm font-semibold text-gray-700">
                                                {conPhaiTra < 0 ? 'Cần hoàn lại cho BN' : conPhaiTra > 0 ? 'BN phải trả thêm' : 'Đã thanh toán đủ'}
                                            </div>
                                            <div className={`font-bold text-lg mt-1 ${conPhaiTra < 0 ? 'text-orange-700' : conPhaiTra > 0 ? 'text-red-700' : 'text-green-700'
                                                }`}>
                                                {Math.abs(conPhaiTra).toLocaleString()} VNĐ
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between" >
                                    <div className="text-sm text-gray-500">Trạng thái</div>
                                    <div className="mt-1">
                                        {receiptData?.status === 'paid' ? (
                                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                                                ĐÃ THANH TOÁN
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold">
                                                CHƯA THANH TOÁN
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="info-item pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Ghi chú</div>
                                    <div className="font-semibold text-gray-800 mt-1">
                                        {receiptData?.note || 'Khám tổng quát'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chi tiết dịch vụ */}
                        <div className="details-section bg-[#F9FAFB] border border-[#E5E7EB] rounded-[15px] p-6 lg:col-span-2">
                            <div className="section-title flex items-center gap-3 mb-5">
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <i className="fas fa-list-ul text-[#2D5016]"></i>
                                </div>
                                <h3 className="text-base font-semibold text-[#1F2937]">Chi tiết dịch vụ</h3>
                            </div>

                            {/* Bảng dịch vụ */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 text-left text-xs font-semibold text-gray-700">MÃ DV</th>
                                            <th className="p-3 text-center text-xs font-semibold text-gray-700">SL</th>
                                            <th className="p-3 text-center text-xs font-semibold text-gray-700">
                                                <div>ĐƠN</div>
                                                <div>GIÁ</div>
                                            </th>
                                            <th className="p-3 text-center text-xs font-semibold text-gray-700">
                                                <div>THÀNH</div>
                                                <div>TIỀN</div>
                                            </th>
                                            <th className="p-3 text-center text-xs font-semibold text-gray-700">
                                                <div>TIỀN</div>
                                                <div>BH</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {receiptData?.services?.length > 0 ? (
                                            receiptData.services.map((service, index) => (
                                                <tr key={index} className="border-t border-gray-100">
                                                    <td className="p-3 text-sm">
                                                        <div className="bg-gray-100 px-2 py-1 rounded">
                                                            <span className="font-bold text-gray-700">{service.code}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-sm text-center">{service.quantity}</td>
                                                    <td className="p-3 text-sm text-center font-bold text-green-600">{service.unitPrice?.toLocaleString()}</td>
                                                    <td className="p-3 text-sm text-center font-bold text-green-600">{service.amount?.toLocaleString()}</td>
                                                    <td className="p-3 text-sm text-center font-bold text-green-600">{service.insuranceAmount?.toLocaleString() || 0}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="border-t border-gray-100">
                                                <td className="p-3 text-sm">
                                                    <div className="bg-gray-100 px-2 py-1 rounded">
                                                        <span className="font-bold text-gray-700">DV001</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-sm text-center">1</td>
                                                <td className="p-3 text-sm text-center font-bold text-green-600">200,000</td>
                                                <td className="p-3 text-sm text-center font-bold text-green-600">200,000</td>
                                                <td className="p-3 text-sm text-center font-bold text-green-600">0</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Phân tích chi phí */}
                            <div className="grid grid-cols-1 gap-5 mt-6">
                                <div className="summary-box bg-gradient-to-br from-[#2D5016] to-[#4A7C23] rounded-lg p-5 text-white">
                                    <div className="title flex items-center gap-2 mb-4 opacity-90">
                                        <i className="fas fa-chart-pie"></i>
                                        <span className="font-semibold">Phân tích chi phí</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex justify-between">
                                            <span className="opacity-80">Tiền khám</span>
                                            <span className="font-bold">{parseFloat(receiptData?.tienKham || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-80">Tiền thuốc</span>
                                            <span className="font-bold">{parseFloat(receiptData?.tienThuoc || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-80">Tiền XN</span>
                                            <span className="font-bold">{parseFloat(receiptData?.tienXetNghiem || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-80">Tiền giường</span>
                                            <span className="font-bold">{parseFloat(receiptData?.tienGiuong || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-80">Tiền PT</span>
                                            <span className="font-bold">{parseFloat(receiptData?.tienPhauThuat || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-80">Tiền khác</span>
                                            <span className="font-bold">{parseFloat(receiptData?.tienKhac || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chi tiết tạm ứng */}
                                {receiptData?.tamUngs && receiptData.tamUngs.filter(tu => !(tu.loaiTamUng === 3 && tu.trangThai === 3)).length > 0 && (
                                    <div className="summary-box bg-blue-50 border border-blue-200 rounded-lg p-5">
                                        <div className="title flex items-center gap-2 mb-4">
                                            <i className="fas fa-wallet text-blue-600"></i>
                                            <span className="font-semibold text-blue-900">Chi tiết tạm ứng</span>
                                        </div>
                                        <div className="space-y-2">
                                            {receiptData.tamUngs
                                                .filter(tu => !(tu.loaiTamUng === 3 && tu.trangThai === 3))
                                                .map((tamUng, index) => (
                                                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded border border-blue-100">
                                                        <div>
                                                            <div className="text-sm font-semibold text-gray-800">{tamUng.maTamUng}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {new Date(tamUng.ngayTamUng).toLocaleDateString('vi-VN')}
                                                            </div>
                                                            {tamUng.ghiChu && (
                                                                <div className="text-xs text-gray-400 mt-1">{tamUng.ghiChu}</div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-bold text-blue-600">
                                                                {parseFloat(tamUng.soTien).toLocaleString()} VNĐ
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                Đã dùng: {parseFloat(tamUng.soTienDaSuDung || 0).toLocaleString()} VNĐ
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Chi tiết hoàn ứng */}
                                {receiptData?.chiTietHoanUng && receiptData.chiTietHoanUng.length > 0 && (
                                    <div className="summary-box bg-orange-50 border border-orange-200 rounded-lg p-5">
                                        <div className="title flex items-center gap-2 mb-4">
                                            <i className="fas fa-hand-holding-usd text-orange-600"></i>
                                            <span className="font-semibold text-orange-900">Chi tiết hoàn ứng</span>
                                        </div>
                                        <div className="space-y-2">
                                            {receiptData.chiTietHoanUng.map((hoanUng, index) => (
                                                <div key={index} className="flex justify-between items-center bg-white p-3 rounded border border-orange-100">
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-800">{hoanUng.maTamUng}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(hoanUng.ngayHoan).toLocaleDateString('vi-VN')}
                                                        </div>
                                                        {hoanUng.ghiChu && (
                                                            <div className="text-xs text-gray-400 mt-1">{hoanUng.ghiChu}</div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-orange-600">
                                                            -{parseFloat(hoanUng.soTienHoan).toLocaleString()} VNĐ
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer bg-[#F9FAFB] border-t border-gray-200 p-6 flex-shrink-0">
                    {(() => {
                        const tongTien = parseFloat(receiptData?.tongTien || 0);
                        const tienBaoHiem = parseFloat(receiptData?.tienBaoHiem || 0);
                        const tongTamUng = receiptData?.tamUngs?.reduce((sum, tu) => {
                            if (tu.loaiTamUng === 3 && tu.trangThai === 3) return sum;
                            return sum + parseFloat(tu.soTien || 0);
                        }, 0) || 0;
                        const tongHoanUng = parseFloat(receiptData?.tongTienHoanUng || 0);
                        const conPhaiTra = tongTien - tienBaoHiem - tongTamUng + tongHoanUng;

                        return (
                            <div className="flex flex-wrap justify-between gap-4">
                                <div className="flex flex-wrap gap-2">
                                    <button className="px-5 py-3 bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white font-bold rounded-lg flex items-center gap-2">
                                        <i className="fas fa-times-circle"></i>
                                        <span>Hủy/Hoàn biên lai</span>
                                    </button>
                                    <button
                                        onClick={handleAdvanceClick}
                                        className="px-5 py-3 bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white font-bold rounded-lg flex items-center gap-2"
                                    >
                                        <i className="fas fa-wallet"></i>
                                        <span>Tạm ứng</span>
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {/* Hiển thị nút Hoàn ứng nếu cần hoàn lại tiền */}
                                    {conPhaiTra < 0 && (
                                        <button
                                            onClick={handleCompleteClick}
                                            className="px-5 py-3 bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white font-bold rounded-lg flex items-center gap-2"
                                        >
                                            <i className="fas fa-hand-holding-usd"></i>
                                            <span>Hoàn ứng {Math.abs(conPhaiTra).toLocaleString()} VNĐ</span>
                                        </button>
                                    )}
                                    {/* Hiển thị nút Thanh toán nếu BN cần trả thêm hoặc đã đủ */}
                                    {conPhaiTra >= 0 && (
                                        <button
                                            onClick={handlePaymentClick}
                                            className="px-5 py-3 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white font-bold rounded-lg flex items-center gap-2"
                                        >
                                            <i className="fas fa-check-circle"></i>
                                            <span>
                                                {conPhaiTra > 0
                                                    ? `Thu thêm ${conPhaiTra.toLocaleString()} VNĐ`
                                                    : 'Hoàn tất thanh toán'
                                                }
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

DetailAccountingPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAdvanceClick: PropTypes.func,
    onCompleteClick: PropTypes.func,
    onPaymentClick: PropTypes.func,
    receiptData: PropTypes.shape({
        code: PropTypes.string,
        recordCode: PropTypes.string,
        createdDate: PropTypes.string,
        collector: PropTypes.string,
        totalAmount: PropTypes.number,
        patientPaid: PropTypes.number,
        insuranceRate: PropTypes.string,
        insuranceAmount: PropTypes.number,
        status: PropTypes.oneOf(['paid', 'unpaid']),
        note: PropTypes.string,
        services: PropTypes.arrayOf(
            PropTypes.shape({
                code: PropTypes.string,
                quantity: PropTypes.number,
                unitPrice: PropTypes.number,
                amount: PropTypes.number,
                insuranceAmount: PropTypes.number
            })
        )
    })
};

DetailAccountingPopup.defaultProps = {
    receiptData: null
};

export default DetailAccountingPopup;
