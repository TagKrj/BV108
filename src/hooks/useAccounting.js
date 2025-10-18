/**
 * Custom Hook for Accounting
 * Hook tùy chỉnh để quản lý state và gọi API cho màn kế toán viện phí
 */

import { useState, useCallback } from 'react';
import accountingService from '../services/api/accountingService';

/**
 * Hook để quản lý biên lai viện phí
 */
export const useReceipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    /**
     * Lấy danh sách biên lai
     */
    const fetchReceipts = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.getReceipts(params);
            
            // API trả về trực tiếp mảng data, không có wrapper
            if (Array.isArray(response)) {
                setReceipts(response);
            } else if (response.data && Array.isArray(response.data)) {
                setReceipts(response.data);
            } else {
                setReceipts([]);
            }
            
            // Xử lý pagination nếu có
            if (response.pagination) {
                setPagination(response.pagination);
            }
            
            return response;
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách biên lai');
            console.error('Error fetching receipts:', err);
            setReceipts([]);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Tạo biên lai mới
     */
    const createReceipt = useCallback(async (receiptData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.createReceipt(receiptData);
            // Reload danh sách sau khi tạo thành công
            await fetchReceipts({ page: pagination.page, limit: pagination.limit });
            return response;
        } catch (err) {
            setError(err.message || 'Không thể tạo biên lai');
            console.error('Error creating receipt:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchReceipts, pagination.page, pagination.limit]);

    /**
     * Cập nhật biên lai
     */
    const updateReceipt = useCallback(async (receiptId, receiptData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.updateReceipt(receiptId, receiptData);
            // Reload danh sách sau khi cập nhật thành công
            await fetchReceipts({ page: pagination.page, limit: pagination.limit });
            return response;
        } catch (err) {
            setError(err.message || 'Không thể cập nhật biên lai');
            console.error('Error updating receipt:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchReceipts, pagination.page, pagination.limit]);

    /**
     * Xóa biên lai
     */
    const deleteReceipt = useCallback(async (receiptId) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.deleteReceipt(receiptId);
            // Reload danh sách sau khi xóa thành công
            await fetchReceipts({ page: pagination.page, limit: pagination.limit });
            return response;
        } catch (err) {
            setError(err.message || 'Không thể xóa biên lai');
            console.error('Error deleting receipt:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchReceipts, pagination.page, pagination.limit]);

    return {
        receipts,
        loading,
        error,
        pagination,
        fetchReceipts,
        createReceipt,
        updateReceipt,
        deleteReceipt
    };
};

/**
 * Hook để quản lý tạm ứng
 */
export const useAdvancePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createAdvancePayment = useCallback(async (advanceData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.createAdvancePayment(advanceData);
            return response;
        } catch (err) {
            setError(err.message || 'Không thể tạo phiếu tạm ứng');
            console.error('Error creating advance payment:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAdvancePaymentDetail = useCallback(async (advanceId) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.getAdvancePaymentDetail(advanceId);
            return response;
        } catch (err) {
            setError(err.message || 'Không thể tải chi tiết tạm ứng');
            console.error('Error fetching advance payment detail:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        createAdvancePayment,
        getAdvancePaymentDetail
    };
};

/**
 * Hook để quản lý hoàn ứng
 */
export const useCompletePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createCompletePayment = useCallback(async (completeData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.createCompletePayment(completeData);
            return response;
        } catch (err) {
            setError(err.message || 'Không thể tạo phiếu hoàn ứng');
            console.error('Error creating complete payment:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCompletePaymentDetail = useCallback(async (completeId) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.getCompletePaymentDetail(completeId);
            return response;
        } catch (err) {
            setError(err.message || 'Không thể tải chi tiết hoàn ứng');
            console.error('Error fetching complete payment detail:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        createCompletePayment,
        getCompletePaymentDetail
    };
};

/**
 * Hook để quản lý thanh toán ra viện
 */
export const useDischargePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createDischargePayment = useCallback(async (dischargeData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.createDischargePayment(dischargeData);
            return response;
        } catch (err) {
            setError(err.message || 'Không thể tạo phiếu thanh toán ra viện');
            console.error('Error creating discharge payment:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getDischargePaymentDetail = useCallback(async (dischargeId) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.getDischargePaymentDetail(dischargeId);
            return response;
        } catch (err) {
            setError(err.message || 'Không thể tải chi tiết thanh toán ra viện');
            console.error('Error fetching discharge payment detail:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        createDischargePayment,
        getDischargePaymentDetail
    };
};

/**
 * Hook để lấy thông tin bệnh nhân
 */
export const usePatientInfo = () => {
    const [patientInfo, setPatientInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPatientInfo = useCallback(async (patientCode) => {
        if (!patientCode) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.getPatientInfo(patientCode);
            setPatientInfo(response.data || null);
            return response;
        } catch (err) {
            setError(err.message || 'Không thể tải thông tin bệnh nhân');
            console.error('Error fetching patient info:', err);
            setPatientInfo(null);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearPatientInfo = useCallback(() => {
        setPatientInfo(null);
        setError(null);
    }, []);

    return {
        patientInfo,
        loading,
        error,
        fetchPatientInfo,
        clearPatientInfo
    };
};

/**
 * Hook để quản lý dịch vụ
 */
export const useServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchServices = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.getServices(params);
            setServices(response.data || []);
            return response;
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách dịch vụ');
            console.error('Error fetching services:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getServiceDetail = useCallback(async (serviceCode) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await accountingService.getServiceDetail(serviceCode);
            return response;
        } catch (err) {
            setError(err.message || 'Không thể tải chi tiết dịch vụ');
            console.error('Error fetching service detail:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        services,
        loading,
        error,
        fetchServices,
        getServiceDetail
    };
};
