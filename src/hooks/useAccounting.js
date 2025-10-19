/**
 * Custom Hook for Accounting
 * Hook tùy chỉnh để quản lý state và gọi API cho màn kế toán viện phí
 */

import { useState, useCallback } from "react";
import accountingService from "../services/api/accountingService";

/**
 * Hook để quản lý biên lai viện phí
 */
export const useReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Lấy danh sách biên lai (UC3: Tra cứu biên lai)
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

      return response;
    } catch (err) {
      setError(err.message || "Không thể tải danh sách biên lai");
      console.error("Error fetching receipts:", err);
      setReceipts([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Tạo biên lai mới (UC1-2: Lập biên lai)
   */
  const createReceipt = useCallback(
    async (receiptData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await accountingService.createReceipt(receiptData);
        // Reload danh sách sau khi tạo thành công
        await fetchReceipts();
        return response;
      } catch (err) {
        setError(err.message || "Không thể tạo biên lai");
        console.error("Error creating receipt:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchReceipts]
  );

  /**
   * Hủy biên lai (UC4: Hủy biên lai)
   */
  const cancelReceipt = useCallback(
    async (receiptId, reason) => {
      setLoading(true);
      setError(null);

      try {
        const response = await accountingService.cancelReceipt(
          receiptId,
          reason
        );
        // Reload danh sách sau khi hủy thành công
        await fetchReceipts();
        return response;
      } catch (err) {
        setError(err.message || "Không thể hủy biên lai");
        console.error("Error canceling receipt:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchReceipts]
  );

  return {
    receipts,
    loading,
    error,
    fetchReceipts,
    createReceipt,
    cancelReceipt,
  };
};

/**
 * Hook để quản lý tạm ứng
 */
export const useAdvancePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Tạo phiếu tạm ứng (UC5-6-7: Thu tạm ứng)
   */
  const createAdvancePayment = useCallback(async (advanceData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await accountingService.createAdvancePayment(
        advanceData
      );
      return response;
    } catch (err) {
      setError(err.message || "Không thể tạo phiếu tạm ứng");
      console.error("Error creating advance payment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createAdvancePayment,
  };
};

/**
 * Hook để quản lý hoàn ứng
 */
export const useCompletePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Tạo phiếu hoàn ứng (UC8: Hoàn ứng)
   */
  const createCompletePayment = useCallback(async (completeData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await accountingService.createCompletePayment(
        completeData
      );
      return response;
    } catch (err) {
      setError(err.message || "Không thể tạo phiếu hoàn ứng");
      console.error("Error creating complete payment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createCompletePayment,
  };
};

/**
 * Hook để quản lý thanh toán ra viện
 */
export const useDischargePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Tạo phiếu thanh toán ra viện (UC9-12: Thanh toán ra viện)
   */
  const createDischargePayment = useCallback(async (dischargeData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await accountingService.createDischargePayment(
        dischargeData
      );
      return response;
    } catch (err) {
      setError(err.message || "Không thể tạo phiếu thanh toán ra viện");
      console.error("Error creating discharge payment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createDischargePayment,
  };
};
