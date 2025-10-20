import React from 'react';
import PropTypes from 'prop-types';
import ExcelJS from 'exceljs';

const DetailAccountingPopup = ({ isOpen, onClose, receiptData, onAdvanceClick, onCompleteClick, onPaymentClick, onCancelClick }) => {
    if (!isOpen) return null;

    // Handler for cancel button click
    const handleCancelClick = () => {
        // Không đóng popup hiện tại, chỉ mở popup hủy biên lai đè lên
        if (onCancelClick) {
            onCancelClick(receiptData);
        }
    };

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

    // Handler for export to Excel with ExcelJS
    const handleExportExcel = async () => {
        if (!receiptData) return;

        try {
            // Tính toán các giá trị
            const tongTien = parseFloat(receiptData.tongTien || 0);
            const tienBaoHiem = parseFloat(receiptData.tienBaoHiem || 0);
            const tongTamUng = receiptData.tamUngs?.reduce((sum, tu) => {
                if (tu.loaiTamUng === 3 && tu.trangThai === 3) return sum;
                return sum + parseFloat(tu.soTien || 0);
            }, 0) || 0;
            const tongHoanUng = parseFloat(receiptData.tongTienHoanUng || 0);
            const conPhaiTra = tongTien - tienBaoHiem - tongTamUng + tongHoanUng;

            // Tạo workbook với ExcelJS
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Hospital Management System';
            workbook.created = new Date();

            // ========== SHEET 1: TỔNG HỢP ==========
            const sheet1 = workbook.addWorksheet('Tổng hợp', {
                views: [{ showGridLines: false }]
            });

            sheet1.columns = [{ width: 28 }, { width: 28 }, { width: 12 }];

            // Title
            sheet1.mergeCells('A1:C1');
            const titleCell = sheet1.getCell('A1');
            titleCell.value = 'BIÊN LAI VIỆN PHÍ';
            titleCell.font = { bold: true, size: 18, color: { argb: 'FF2D5016' } };
            titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
            sheet1.getRow(1).height = 30;

            sheet1.getRow(2).height = 8;

            // Section 1: Thông tin biên lai
            const infoHeaderCell = sheet1.getCell('A3');
            infoHeaderCell.value = 'Mã biên lai:';
            infoHeaderCell.font = { bold: true, size: 11, color: { argb: 'FF2D5016' } };
            infoHeaderCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
            sheet1.getCell('B3').value = receiptData.code || 'VP2025000008';

            sheet1.getCell('A4').value = 'Mã hồ sơ:';
            sheet1.getCell('B4').value = receiptData.recordCode || 'HS001';

            sheet1.getCell('A5').value = 'Ngày tạo:';
            sheet1.getCell('B5').value = receiptData.createdDate || '07/10/2025 - 16:18';

            sheet1.getCell('A6').value = 'Người thu:';
            sheet1.getCell('B6').value = receiptData.collector || 'admin';

            sheet1.getCell('A7').value = 'Trạng thái:';
            sheet1.getCell('B7').value = receiptData.status === 'cancelled' ? 'ĐÃ HỦY' : receiptData.status === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN';

            sheet1.getRow(8).height = 8;

            // Section 2: Thông tin thanh toán
            const paymentHeaderCell = sheet1.getCell('A9');
            paymentHeaderCell.value = 'THÔNG TIN THANH TOÁN';
            paymentHeaderCell.font = { bold: true, size: 11, color: { argb: 'FF2D5016' } };
            paymentHeaderCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };

            sheet1.getRow(10).height = 8;

            const paymentData = [
                ['Tổng tiền:', tongTien, 'VNĐ'],
                ['Tỷ lệ bảo hiểm chi trả:', receiptData.insuranceRate || '0%', ''],
                ['Tiền bảo hiểm:', tienBaoHiem, 'VNĐ'],
                ['Đã tạm ứng:', tongTamUng, 'VNĐ'],
                ['Đã hoàn ứng:', tongHoanUng, 'VNĐ'],
                ['Tiền BN phải trả:', tongTien - tienBaoHiem, 'VNĐ'],
                ['Còn phải trả:', Math.abs(conPhaiTra), 'VNĐ']
            ];

            paymentData.forEach((row, index) => {
                const rowNum = 11 + index;
                sheet1.getCell(`A${rowNum}`).value = row[0];
                sheet1.getCell(`B${rowNum}`).value = row[1];
                if (typeof row[1] === 'number') {
                    sheet1.getCell(`B${rowNum}`).numFmt = '#,##0';
                }
                sheet1.getCell(`C${rowNum}`).value = row[2];
            });

            sheet1.getRow(18).height = 8;
            sheet1.getCell('A19').value = 'Ghi chú:';
            sheet1.getCell('B19').value = receiptData.note || 'Khám tổng quát';

            // ========== SHEET 2: CHI TIẾT DỊCH VỤ ==========
            const sheet2 = workbook.addWorksheet('Chi tiết dịch vụ');
            sheet2.columns = [
                { width: 20 },
                { width: 12 },
                { width: 18 },
                { width: 20 },
                { width: 22 }
            ];

            // Header
            const header2 = sheet2.getRow(1);
            header2.values = ['MÃ DỊCH VỤ', 'SỐ LƯỢNG', 'ĐƠN GIÁ (VNĐ)', 'THÀNH TIỀN (VNĐ)', 'TIỀN BẢO HIỂM (VNĐ)'];
            header2.height = 25;
            header2.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
            header2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2D5016' } };
            header2.alignment = { horizontal: 'center', vertical: 'middle' };
            header2.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // Data rows
            let rowIndex = 2;
            if (receiptData.services?.length > 0) {
                receiptData.services.forEach(service => {
                    const row = sheet2.getRow(rowIndex);
                    row.values = [
                        service.code,
                        service.quantity,
                        service.unitPrice || 0,
                        service.amount || 0,
                        service.insuranceAmount || 0
                    ];

                    row.eachCell((cell, colNumber) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle' };

                        if (colNumber >= 3 && colNumber <= 5) {
                            cell.numFmt = '#,##0';
                            cell.alignment = { ...cell.alignment, horizontal: 'right' };
                        }
                    });

                    rowIndex++;
                });
            } else {
                const row = sheet2.getRow(rowIndex);
                row.values = ['Không có dữ liệu', '', '', '', ''];
                row.eachCell(cell => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
                rowIndex++;
            }

            // Total row
            const totalRow2 = sheet2.getRow(rowIndex);
            totalRow2.values = ['TỔNG CỘNG:', '', '', tongTien, tienBaoHiem];
            totalRow2.font = { bold: true, size: 11 };
            totalRow2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
            totalRow2.eachCell((cell, colNumber) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle' };

                if (colNumber === 4 || colNumber === 5) {
                    cell.numFmt = '#,##0';
                    cell.alignment = { ...cell.alignment, horizontal: 'right' };
                }
            });

            // ========== SHEET 3: CHI TIẾT TẠM ỨNG ==========
            const sheet3 = workbook.addWorksheet('Chi tiết tạm ứng');
            sheet3.columns = [
                { width: 8 },
                { width: 22 },
                { width: 18 },
                { width: 20 },
                { width: 38 }
            ];

            // Header
            const header3 = sheet3.getRow(1);
            header3.values = ['STT', 'MÃ TẠM ỨNG', 'NGÀY TẠM ỨNG', 'SỐ TIỀN (VNĐ)', 'GHI CHÚ'];
            header3.height = 25;
            header3.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
            header3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2D5016' } };
            header3.alignment = { horizontal: 'center', vertical: 'middle' };
            header3.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // Data
            const tamUngFiltered = receiptData.tamUngs?.filter(tu => !(tu.loaiTamUng === 3 && tu.trangThai === 3)) || [];

            let rowIndex3 = 2;
            if (tamUngFiltered.length > 0) {
                tamUngFiltered.forEach((tu, index) => {
                    const row = sheet3.getRow(rowIndex3);
                    row.values = [
                        index + 1,
                        tu.maTamUng,
                        new Date(tu.ngayTamUng).toLocaleDateString('vi-VN'),
                        parseFloat(tu.soTien) || 0,
                        tu.ghiChu || ''
                    ];

                    row.eachCell((cell, colNumber) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle' };

                        if (colNumber === 1) {
                            cell.alignment = { ...cell.alignment, horizontal: 'center' };
                        }
                        if (colNumber === 4) {
                            cell.numFmt = '#,##0';
                            cell.alignment = { ...cell.alignment, horizontal: 'right' };
                        }
                    });

                    rowIndex3++;
                });

                // Total
                const tamUngSum = tamUngFiltered.reduce((sum, tu) => sum + (parseFloat(tu.soTien) || 0), 0);
                const totalRow3 = sheet3.getRow(rowIndex3);
                totalRow3.values = ['', 'TỔNG CỘNG:', '', tamUngSum, ''];
                totalRow3.font = { bold: true, size: 11 };
                totalRow3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
                totalRow3.eachCell((cell, colNumber) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { vertical: 'middle' };

                    if (colNumber === 4) {
                        cell.numFmt = '#,##0';
                        cell.alignment = { ...cell.alignment, horizontal: 'right' };
                    }
                });
            } else {
                const row = sheet3.getRow(rowIndex3);
                row.values = [1, 'Không có dữ liệu tạm ứng', '', '', ''];
                row.eachCell(cell => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                });
            }

            // ========== SHEET 4: CHI TIẾT HOÀN ỨNG ==========
            const sheet4 = workbook.addWorksheet('Chi tiết hoàn ứng');
            sheet4.columns = [
                { width: 8 },
                { width: 22 },
                { width: 18 },
                { width: 22 },
                { width: 38 }
            ];

            // Header
            const header4 = sheet4.getRow(1);
            header4.values = ['STT', 'MÃ TẠM ỨNG', 'NGÀY HOÀN', 'SỐ TIỀN HOÀN (VNĐ)', 'GHI CHÚ'];
            header4.height = 25;
            header4.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
            header4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2D5016' } };
            header4.alignment = { horizontal: 'center', vertical: 'middle' };
            header4.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // Data
            const hoanUngData = receiptData.chiTietHoanUng || [];

            let rowIndex4 = 2;
            if (hoanUngData.length > 0) {
                hoanUngData.forEach((hu, index) => {
                    const row = sheet4.getRow(rowIndex4);
                    row.values = [
                        index + 1,
                        hu.maTamUng,
                        new Date(hu.ngayHoan).toLocaleDateString('vi-VN'),
                        parseFloat(hu.soTienHoan) || 0,
                        hu.ghiChu || ''
                    ];

                    row.eachCell((cell, colNumber) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle' };

                        if (colNumber === 1) {
                            cell.alignment = { ...cell.alignment, horizontal: 'center' };
                        }
                        if (colNumber === 4) {
                            cell.numFmt = '#,##0';
                            cell.alignment = { ...cell.alignment, horizontal: 'right' };
                        }
                    });

                    rowIndex4++;
                });

                // Total
                const hoanUngSum = hoanUngData.reduce((sum, hu) => sum + (parseFloat(hu.soTienHoan) || 0), 0);
                const totalRow4 = sheet4.getRow(rowIndex4);
                totalRow4.values = ['', 'TỔNG CỘNG:', '', hoanUngSum, ''];
                totalRow4.font = { bold: true, size: 11 };
                totalRow4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
                totalRow4.eachCell((cell, colNumber) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { vertical: 'middle' };

                    if (colNumber === 4) {
                        cell.numFmt = '#,##0';
                        cell.alignment = { ...cell.alignment, horizontal: 'right' };
                    }
                });
            } else {
                const row = sheet4.getRow(rowIndex4);
                row.values = [1, 'Không có dữ liệu hoàn ứng', '', '', ''];
                row.eachCell(cell => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                });
            }

            // Xuất file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `BienlaiVienPhi_${receiptData.code || 'VP2025000008'}_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error exporting Excel:', error);
            alert('Có lỗi xảy ra khi xuất file Excel!');
        }

        // Helper function to apply borders and styles
        const applyBordersAndStyles = (ws, dataLength, colCount, hasTotal = false) => {
            const borderStyle = {
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } }
            };

            const headerStyle = {
                fill: { fgColor: { rgb: '2D5016' } },
                font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: borderStyle
            };

            const cellStyle = {
                border: borderStyle,
                alignment: { vertical: 'center' }
            };

            const totalStyle = {
                fill: { fgColor: { rgb: 'E8F5E9' } },
                font: { bold: true, sz: 11 },
                border: borderStyle,
                alignment: { vertical: 'center' }
            };

            // Apply header style (row 1)
            for (let col = 0; col < colCount; col++) {
                const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
                if (!ws[cellRef]) ws[cellRef] = {};
                ws[cellRef].s = headerStyle;
            }

            // Apply data cell borders
            for (let row = 1; row < dataLength; row++) {
                for (let col = 0; col < colCount; col++) {
                    const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
                    if (!ws[cellRef]) ws[cellRef] = { v: '', t: 's' };
                    ws[cellRef].s = cellStyle;
                }
            }

            // Apply total row style if exists
            if (hasTotal && dataLength > 1) {
                const totalRowIndex = dataLength - 1;
                for (let col = 0; col < colCount; col++) {
                    const cellRef = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
                    if (!ws[cellRef]) ws[cellRef] = { v: '', t: 's' };
                    ws[cellRef].s = totalStyle;
                }
            }
        };

        // Tạo workbook
        const wb = XLSX.utils.book_new();

        // ========== Sheet 1: Thông tin tổng hợp ==========
        const summaryData = [
            ['BIÊN LAI VIỆN PHÍ'],
            [''],
            ['Mã biên lai:', receiptData.code || 'VP2025000008'],
            ['Mã hồ sơ:', receiptData.recordCode || 'HS001'],
            ['Ngày tạo:', receiptData.createdDate || '07/10/2025 - 16:18'],
            ['Người thu:', receiptData.collector || 'admin'],
            ['Trạng thái:', receiptData.status === 'cancelled' ? 'ĐÃ HỦY' : receiptData.status === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'],
            [''],
            ['THÔNG TIN THANH TOÁN'],
            [''],
            ['Tổng tiền:', tongTien, 'VNĐ'],
            ['Tỷ lệ bảo hiểm chi trả:', receiptData.insuranceRate || '0%'],
            ['Tiền bảo hiểm:', tienBaoHiem, 'VNĐ'],
            ['Đã tạm ứng:', tongTamUng, 'VNĐ'],
            ['Đã hoàn ứng:', tongHoanUng, 'VNĐ'],
            ['Tiền BN phải trả:', tongTien - tienBaoHiem, 'VNĐ'],
            ['Còn phải trả:', Math.abs(conPhaiTra), 'VNĐ'],
            [''],
            ['Ghi chú:', receiptData.note || 'Khám tổng quát']
        ];

        const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
        ws1['!cols'] = [{ wch: 25 }, { wch: 25 }, { wch: 10 }];

        // Style title
        ws1['A1'].s = {
            font: { bold: true, sz: 16, color: { rgb: '2D5016' } },
            alignment: { horizontal: 'center', vertical: 'center' }
        };
        ws1['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];

        // Style section headers
        ['A9', 'A3'].forEach(cell => {
            if (ws1[cell]) {
                ws1[cell].s = {
                    font: { bold: true, sz: 12, color: { rgb: '2D5016' } },
                    fill: { fgColor: { rgb: 'E8F5E9' } }
                };
            }
        });

        // Format number cells
        ['B11', 'B13', 'B14', 'B15', 'B16', 'B17'].forEach(cell => {
            if (ws1[cell] && typeof ws1[cell].v === 'number') {
                ws1[cell].z = '#,##0';
            }
        });

        XLSX.utils.book_append_sheet(wb, ws1, 'Tổng hợp');

        // ========== Sheet 2: Chi tiết dịch vụ ==========
        const servicesHeader = [['MÃ DỊCH VỤ', 'SỐ LƯỢNG', 'ĐơN GIÁ (VNĐ)', 'THÀNH TIỀN (VNĐ)', 'TIỀN BẢO HIỂM (VNĐ)']];
        const servicesData = receiptData.services?.length > 0
            ? receiptData.services.map(service => [
                service.code,
                service.quantity,
                service.unitPrice || 0,
                service.amount || 0,
                service.insuranceAmount || 0
            ])
            : [['Không có dữ liệu', '', '', '', '']];

        const servicesTotal = [
            ['TỔNG CỘNG:', '', '', tongTien, tienBaoHiem]
        ];

        const ws2Data = [...servicesHeader, ...servicesData, ...servicesTotal];
        const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
        ws2['!cols'] = [{ wch: 18 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 22 }];

        applyBordersAndStyles(ws2, ws2Data.length, 5, true);

        // Format number columns
        for (let row = 1; row < ws2Data.length; row++) {
            ['C', 'D', 'E'].forEach(col => {
                const cellRef = col + (row + 1);
                if (ws2[cellRef] && typeof ws2[cellRef].v === 'number') {
                    ws2[cellRef].z = '#,##0';
                }
            });
        }

        XLSX.utils.book_append_sheet(wb, ws2, 'Chi tiết dịch vụ');

        // ========== Sheet 3: Chi tiết tạm ứng ==========
        const tamUngFiltered = receiptData.tamUngs?.filter(tu => !(tu.loaiTamUng === 3 && tu.trangThai === 3)) || [];

        const tamUngHeader = [['STT', 'MÃ TẠM ỨNG', 'NGÀY TẠM ỨNG', 'SỐ TIỀN (VNĐ)', 'GHI CHÚ']];
        const tamUngData = tamUngFiltered.length > 0
            ? tamUngFiltered.map((tu, index) => [
                index + 1,
                tu.maTamUng,
                new Date(tu.ngayTamUng).toLocaleDateString('vi-VN'),
                parseFloat(tu.soTien) || 0,
                tu.ghiChu || ''
            ])
            : [[1, 'Không có dữ liệu tạm ứng', '', '', '']];

        const tamUngSum = tamUngFiltered.reduce((sum, tu) => sum + (parseFloat(tu.soTien) || 0), 0);
        const tamUngTotal = [
            ['', 'TỔNG CỘNG:', '', tamUngSum, '']
        ];

        const ws3Data = [...tamUngHeader, ...tamUngData, ...(tamUngFiltered.length > 0 ? tamUngTotal : [])];
        const ws3 = XLSX.utils.aoa_to_sheet(ws3Data);
        ws3['!cols'] = [{ wch: 8 }, { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 35 }];

        applyBordersAndStyles(ws3, ws3Data.length, 5, tamUngFiltered.length > 0);

        // Format number column
        for (let row = 1; row < ws3Data.length; row++) {
            const cellRef = 'D' + (row + 1);
            if (ws3[cellRef] && typeof ws3[cellRef].v === 'number') {
                ws3[cellRef].z = '#,##0';
            }
        }

        XLSX.utils.book_append_sheet(wb, ws3, 'Chi tiết tạm ứng');

        // ========== Sheet 4: Chi tiết hoàn ứng ==========
        const hoanUngData = receiptData.chiTietHoanUng || [];

        const hoanUngHeader = [['STT', 'MÃ TẠM ỨNG', 'NGÀY HOÀN', 'SỐ TIỀN HOÀN (VNĐ)', 'GHI CHÚ']];
        const hoanUngRows = hoanUngData.length > 0
            ? hoanUngData.map((hu, index) => [
                index + 1,
                hu.maTamUng,
                new Date(hu.ngayHoan).toLocaleDateString('vi-VN'),
                parseFloat(hu.soTienHoan) || 0,
                hu.ghiChu || ''
            ])
            : [[1, 'Không có dữ liệu hoàn ứng', '', '', '']];

        const hoanUngSum = hoanUngData.reduce((sum, hu) => sum + (parseFloat(hu.soTienHoan) || 0), 0);
        const hoanUngTotal = [
            ['', 'TỔNG CỘNG:', '', hoanUngSum, '']
        ];

        const ws4Data = [...hoanUngHeader, ...hoanUngRows, ...(hoanUngData.length > 0 ? hoanUngTotal : [])];
        const ws4 = XLSX.utils.aoa_to_sheet(ws4Data);
        ws4['!cols'] = [{ wch: 8 }, { wch: 22 }, { wch: 18 }, { wch: 20 }, { wch: 35 }];

        applyBordersAndStyles(ws4, ws4Data.length, 5, hoanUngData.length > 0);

        // Format number column
        for (let row = 1; row < ws4Data.length; row++) {
            const cellRef = 'D' + (row + 1);
            if (ws4[cellRef] && typeof ws4[cellRef].v === 'number') {
                ws4[cellRef].z = '#,##0';
            }
        }

        XLSX.utils.book_append_sheet(wb, ws4, 'Chi tiết hoàn ứng');

        // Xuất file
        const fileName = `BienlaiVienPhi_${receiptData.code || 'VP2025000008'}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
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
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportExcel}
                            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:bg-white hover:bg-opacity-20 cursor-pointer"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                            title="Xuất Excel"
                        >
                            <i className="fas fa-file-excel text-white"></i>
                            <span className="text-white text-sm font-semibold">Xuất Excel</span>
                        </button>
                        <button
                            className="w-8 h-8 rounded-[5px] flex items-center justify-center transition-all hover:bg-white hover:bg-opacity-20 cursor-pointer"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                            onClick={onClose}
                        >
                            <i className="fas fa-times text-white"></i>
                        </button>
                    </div>
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

                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Tỷ lệ bảo hiểm chi trả</div>
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


                                <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between">
                                    <div className="text-sm text-gray-500">Tiền BN phải trả</div>
                                    <div className="font-bold text-green-600 mt-1">
                                        {receiptData?.patientPaid?.toLocaleString() || '200,000'} VNĐ
                                    </div>
                                </div>

                                {(() => {
                                    // Nếu trạng thái đã thanh toán, luôn hiển thị "Đã thanh toán đủ"
                                    if (receiptData?.status === 'paid') {
                                        return (
                                            <div className="info-item border-b border-gray-200 pb-2 flex flex-row items-center justify-between bg-green-50 -mx-3 px-3 py-2 rounded">
                                                <div className="text-sm font-semibold text-gray-700">
                                                    Đã thanh toán đủ
                                                </div>
                                                <div className="font-bold text-lg mt-1 text-green-700">
                                                    0 VNĐ
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Nếu chưa thanh toán, tính toán như bình thường
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
                                        {receiptData?.status === 'cancelled' ? (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">
                                                ĐÃ HỦY
                                            </span>
                                        ) : receiptData?.status === 'paid' ? (
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
                                {/* <div className="summary-box bg-gradient-to-br from-[#2D5016] to-[#4A7C23] rounded-lg p-5 text-white">
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
                                </div> */}

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
                                                            {/* <div className="text-xs text-gray-500">
                                                                Đã dùng: {parseFloat(tamUng.soTienDaSuDung || 0).toLocaleString()} VNĐ
                                                            </div> */}
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
                        // Nếu biên lai đã hủy, không hiển thị các nút hành động
                        if (receiptData?.status === 'cancelled') {
                            return (
                                <div className="flex justify-center items-center py-4">
                                    <div className="text-center">
                                        <i className="fas fa-info-circle text-gray-400 text-2xl mb-2"></i>
                                        <p className="text-gray-500 font-medium">Biên lai đã bị hủy, không thể thực hiện các thao tác</p>
                                    </div>
                                </div>
                            );
                        }

                        // Nếu biên lai đã thanh toán, không hiển thị các nút hành động
                        if (receiptData?.status === 'paid') {
                            return (
                                <div className="flex justify-center items-center py-4">
                                    <div className="text-center">
                                        <i className="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                                        <p className="text-green-600 font-medium">Biên lai đã thanh toán hoàn tất</p>
                                    </div>
                                </div>
                            );
                        }

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
                                    <button
                                        onClick={handleCancelClick}
                                        className="px-5 py-3 bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white font-bold rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        <i className="fas fa-times-circle"></i>
                                        <span>Hủy/Hoàn biên lai</span>
                                    </button>
                                    <button
                                        onClick={handleAdvanceClick}
                                        className="px-5 py-3 bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white font-bold rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
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
    onCancelClick: PropTypes.func,
    receiptData: PropTypes.shape({
        code: PropTypes.string,
        recordCode: PropTypes.string,
        createdDate: PropTypes.string,
        collector: PropTypes.string,
        totalAmount: PropTypes.number,
        patientPaid: PropTypes.number,
        insuranceRate: PropTypes.string,
        insuranceAmount: PropTypes.number,
        status: PropTypes.oneOf(['paid', 'unpaid', 'cancelled']),
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
