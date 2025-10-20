/**
 * Accounting Service
 * Service xử lý các API liên quan đến kế toán viện phí
 */

import apiClient from "./apiClient";

const ACCOUNTING_ENDPOINTS = {
  // Biên lai viện phí
  RECEIPTS: "/hospital-fee/bien-lai/tra-cuu",
  CREATE_RECEIPT: "/hospital-fee/bien-lai",
  CANCEL_RECEIPT: (id) => `/hospital-fee/bien-lai/${id}/huy`,

  // Bệnh án
  MEDICAL_RECORDS: "/benhan",

  // Dịch vụ
  SERVICES: "/dichvu",

  // Tạm ứng
  ADVANCE_PAYMENT: "/hospital-fee/tam-ung",

  // Hoàn ứng
  COMPLETE_PAYMENT: "/hospital-fee/tam-ung/hoan",

  // Thanh toán ra viện
  DISCHARGE_PAYMENT: "/hospital-fee/thanh-toan-ra-vien",

  // Công nợ
  DEBT: "/hospital-fee/cong-no",
  DEBT_TRACKING: "/hospital-fee/cong-no/theo-doi",
  DEBT_PAYMENT: "/hospital-fee/cong-no/thanh-toan",
  DEBT_REPORT: "/hospital-fee/cong-no/bao-cao",

  // Báo cáo
  REVENUE_REPORT: "/hospital-fee/bao-cao/thu-chi",
};

class AccountingService {
  /**
   * Lấy danh sách biên lai viện phí (UC3: Tra cứu biên lai)
   * @param {Object} params - Query parameters (maBenhNhan, maVienPhi, tuNgay, denNgay)
   * @returns {Promise} Response data
   */
  async getReceipts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${ACCOUNTING_ENDPOINTS.RECEIPTS}?${queryString}`
      : ACCOUNTING_ENDPOINTS.RECEIPTS;

    return await apiClient.get(endpoint);
  }

  /**
   * Lập biên lai viện phí (UC1-2: Lập biên lai)
   * @param {Object} receiptData - Dữ liệu biên lai {maHoSo, loaiHoSo, chiTiet[], ghiChu}
   * @returns {Promise} Created receipt
   */
  async createReceipt(receiptData) {
    return await apiClient.post(
      ACCOUNTING_ENDPOINTS.CREATE_RECEIPT,
      receiptData
    );
  }

  /**
   * Lấy danh sách bệnh án (hồ sơ bệnh nhân)
   * @param {Object} params - Query parameters
   * @returns {Promise} Medical records list
   */
  async getMedicalRecords(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${ACCOUNTING_ENDPOINTS.MEDICAL_RECORDS}?${queryString}`
      : ACCOUNTING_ENDPOINTS.MEDICAL_RECORDS;

    return await apiClient.get(endpoint);
  }

  /**
   * Lấy danh sách dịch vụ
   * @param {Object} params - Query parameters
   * @returns {Promise} Services list
   */
  async getServices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${ACCOUNTING_ENDPOINTS.SERVICES}?${queryString}`
      : ACCOUNTING_ENDPOINTS.SERVICES;

    return await apiClient.get(endpoint);
  }

  /**
   * Hủy/Hoàn biên lai (UC4: Hủy biên lai)
   * @param {string} receiptId - ID của biên lai
   * @param {string} reason - Lý do hủy
   * @returns {Promise} Cancel result
   */
  async cancelReceipt(receiptId, reason) {
    return await apiClient.post(
      ACCOUNTING_ENDPOINTS.CANCEL_RECEIPT(receiptId),
      { lyDo: reason }
    );
  }

  /**
   * Tạo phiếu tạm ứng (UC5-6-7: Thu tạm ứng)
   * @param {Object} advanceData - Dữ liệu tạm ứng {maBenhNhan, loaiTamUng, soTien, maHoSo?, ghiChu?}
   * @returns {Promise} Created advance payment
   */
  async createAdvancePayment(advanceData) {
    return await apiClient.post(
      ACCOUNTING_ENDPOINTS.ADVANCE_PAYMENT,
      advanceData
    );
  }

  /**
   * Tạo phiếu hoàn ứng (UC8: Hoàn ứng)
   * @param {Object} completeData - Dữ liệu hoàn ứng {maTamUng, soTienHoan, ghiChu?}
   * @returns {Promise} Created complete payment
   */
  async createCompletePayment(completeData) {
    return await apiClient.post(
      ACCOUNTING_ENDPOINTS.COMPLETE_PAYMENT,
      completeData
    );
  }

  /**
   * Tạo phiếu thanh toán ra viện (UC9-12: Thanh toán ra viện)
   * @param {Object} dischargeData - Dữ liệu thanh toán {maHoSo, danhSachTamUng[], tienMienGiam?, lyDoMienGiam?, ghiChu?}
   * @returns {Promise} Created discharge payment
   */
  async createDischargePayment(dischargeData) {
    return await apiClient.post(
      ACCOUNTING_ENDPOINTS.DISCHARGE_PAYMENT,
      dischargeData
    );
  }

  /**
   * Ghi nhận công nợ (UC13: Ghi nhận công nợ)
   * @param {Object} debtData - Dữ liệu công nợ {maBenhNhan, maVienPhi, soTienNo, ngayHetHan, ghiChu?}
   * @returns {Promise} Created debt
   */
  async createDebt(debtData) {
    return await apiClient.post(ACCOUNTING_ENDPOINTS.DEBT, debtData);
  }

  /**
   * Theo dõi công nợ (UC14: Theo dõi công nợ)
   * @param {Object} params - Query parameters (maBenhNhan?, trangThai?)
   * @returns {Promise} Debt tracking list
   */
  async getDebtTracking(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${ACCOUNTING_ENDPOINTS.DEBT_TRACKING}?${queryString}`
      : ACCOUNTING_ENDPOINTS.DEBT_TRACKING;

    return await apiClient.get(endpoint);
  }

  /**
   * Thanh toán nợ (UC15: Thanh toán nợ)
   * @param {Object} paymentData - Dữ liệu thanh toán {maCongNo, soTienTra, ghiChu?}
   * @returns {Promise} Payment result
   */
  async payDebt(paymentData) {
    return await apiClient.post(ACCOUNTING_ENDPOINTS.DEBT_PAYMENT, paymentData);
  }

  /**
   * Báo cáo công nợ (UC16: Báo cáo công nợ)
   * @param {Object} params - Query parameters (tuNgay, denNgay)
   * @returns {Promise} Debt report
   */
  async getDebtReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${ACCOUNTING_ENDPOINTS.DEBT_REPORT}?${queryString}`
      : ACCOUNTING_ENDPOINTS.DEBT_REPORT;

    return await apiClient.get(endpoint);
  }

  /**
   * Báo cáo thu chi (UC21: Báo cáo thu chi)
   * @param {Object} params - Query parameters (tuNgay, denNgay, maKhoa?)
   * @returns {Promise} Revenue report
   */
  async getRevenueReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${ACCOUNTING_ENDPOINTS.REVENUE_REPORT}?${queryString}`
      : ACCOUNTING_ENDPOINTS.REVENUE_REPORT;

    return await apiClient.get(endpoint);
  }
}

// Export singleton instance
export default new AccountingService();
