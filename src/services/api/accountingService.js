/**
 * Accounting Service
 * Service xử lý các API liên quan đến kế toán viện phí
 */

import apiClient from './apiClient';

const ACCOUNTING_ENDPOINTS = {
    // Biên lai viện phí
    RECEIPTS: '/now/v1/hospital-fee/bien-lai/tra-cuu',
    RECEIPT_DETAIL: (id) => `/accounting/receipts/${id}`,
    CREATE_RECEIPT: '/accounting/receipts',
    UPDATE_RECEIPT: (id) => `/accounting/receipts/${id}`,
    DELETE_RECEIPT: (id) => `/accounting/receipts/${id}`,
    
    // Tạm ứng
    ADVANCE_PAYMENT: '/accounting/advance-payment',
    ADVANCE_PAYMENT_DETAIL: (id) => `/accounting/advance-payment/${id}`,
    
    // Hoàn ứng
    COMPLETE_PAYMENT: '/accounting/complete-payment',
    COMPLETE_PAYMENT_DETAIL: (id) => `/accounting/complete-payment/${id}`,
    
    // Thanh toán ra viện
    DISCHARGE_PAYMENT: '/accounting/discharge-payment',
    DISCHARGE_PAYMENT_DETAIL: (id) => `/accounting/discharge-payment/${id}`,
    
    // Thông tin bệnh nhân
    PATIENT_INFO: (patientCode) => `/patients/${patientCode}`,
    
    // Dịch vụ
    SERVICES: '/services',
    SERVICE_DETAIL: (serviceCode) => `/services/${serviceCode}`,
    
    // Báo cáo thống kê
    STATISTICS: '/accounting/statistics',
    REVENUE_REPORT: '/accounting/reports/revenue',
};

class AccountingService {
    /**
     * Lấy danh sách biên lai viện phí
     * @param {Object} params - Query parameters (page, limit, status, patientCode, dateFrom, dateTo)
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
     * Lấy chi tiết biên lai theo ID
     * @param {string} receiptId - ID của biên lai
     * @returns {Promise} Receipt detail
     */
    async getReceiptDetail(receiptId) {
        return await apiClient.get(ACCOUNTING_ENDPOINTS.RECEIPT_DETAIL(receiptId));
    }

    /**
     * Tạo biên lai viện phí mới
     * @param {Object} receiptData - Dữ liệu biên lai
     * @returns {Promise} Created receipt
     */
    async createReceipt(receiptData) {
        return await apiClient.post(ACCOUNTING_ENDPOINTS.CREATE_RECEIPT, receiptData);
    }

    /**
     * Cập nhật biên lai viện phí
     * @param {string} receiptId - ID của biên lai
     * @param {Object} receiptData - Dữ liệu cập nhật
     * @returns {Promise} Updated receipt
     */
    async updateReceipt(receiptId, receiptData) {
        return await apiClient.put(
            ACCOUNTING_ENDPOINTS.UPDATE_RECEIPT(receiptId), 
            receiptData
        );
    }

    /**
     * Xóa biên lai viện phí
     * @param {string} receiptId - ID của biên lai
     * @returns {Promise} Delete result
     */
    async deleteReceipt(receiptId) {
        return await apiClient.delete(ACCOUNTING_ENDPOINTS.DELETE_RECEIPT(receiptId));
    }

    /**
     * Tạo phiếu tạm ứng
     * @param {Object} advanceData - Dữ liệu tạm ứng
     * @returns {Promise} Created advance payment
     */
    async createAdvancePayment(advanceData) {
        return await apiClient.post(ACCOUNTING_ENDPOINTS.ADVANCE_PAYMENT, advanceData);
    }

    /**
     * Lấy chi tiết tạm ứng
     * @param {string} advanceId - ID của phiếu tạm ứng
     * @returns {Promise} Advance payment detail
     */
    async getAdvancePaymentDetail(advanceId) {
        return await apiClient.get(ACCOUNTING_ENDPOINTS.ADVANCE_PAYMENT_DETAIL(advanceId));
    }

    /**
     * Tạo phiếu hoàn ứng
     * @param {Object} completeData - Dữ liệu hoàn ứng
     * @returns {Promise} Created complete payment
     */
    async createCompletePayment(completeData) {
        return await apiClient.post(ACCOUNTING_ENDPOINTS.COMPLETE_PAYMENT, completeData);
    }

    /**
     * Lấy chi tiết hoàn ứng
     * @param {string} completeId - ID của phiếu hoàn ứng
     * @returns {Promise} Complete payment detail
     */
    async getCompletePaymentDetail(completeId) {
        return await apiClient.get(ACCOUNTING_ENDPOINTS.COMPLETE_PAYMENT_DETAIL(completeId));
    }

    /**
     * Tạo phiếu thanh toán ra viện
     * @param {Object} dischargeData - Dữ liệu thanh toán ra viện
     * @returns {Promise} Created discharge payment
     */
    async createDischargePayment(dischargeData) {
        return await apiClient.post(ACCOUNTING_ENDPOINTS.DISCHARGE_PAYMENT, dischargeData);
    }

    /**
     * Lấy chi tiết thanh toán ra viện
     * @param {string} dischargeId - ID của phiếu thanh toán ra viện
     * @returns {Promise} Discharge payment detail
     */
    async getDischargePaymentDetail(dischargeId) {
        return await apiClient.get(ACCOUNTING_ENDPOINTS.DISCHARGE_PAYMENT_DETAIL(dischargeId));
    }

    /**
     * Lấy thông tin bệnh nhân theo mã
     * @param {string} patientCode - Mã bệnh nhân
     * @returns {Promise} Patient information
     */
    async getPatientInfo(patientCode) {
        return await apiClient.get(ACCOUNTING_ENDPOINTS.PATIENT_INFO(patientCode));
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
     * Lấy chi tiết dịch vụ theo mã
     * @param {string} serviceCode - Mã dịch vụ
     * @returns {Promise} Service detail
     */
    async getServiceDetail(serviceCode) {
        return await apiClient.get(ACCOUNTING_ENDPOINTS.SERVICE_DETAIL(serviceCode));
    }

    /**
     * Lấy thống kê kế toán
     * @param {Object} params - Query parameters (dateFrom, dateTo)
     * @returns {Promise} Statistics data
     */
    async getStatistics(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString 
            ? `${ACCOUNTING_ENDPOINTS.STATISTICS}?${queryString}`
            : ACCOUNTING_ENDPOINTS.STATISTICS;
        
        return await apiClient.get(endpoint);
    }

    /**
     * Lấy báo cáo doanh thu
     * @param {Object} params - Query parameters (dateFrom, dateTo, groupBy)
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
