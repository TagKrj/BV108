/**
 * Service Service
 * Service xử lý các API liên quan đến dịch vụ
 */

import apiClient from "./apiClient";

const SERVICE_ENDPOINTS = {
  SERVICES: "/dichvu",
  DELETE_SERVICE: (maDichVu) => `/dichvu/${maDichVu}`,
};

class ServiceService {
  /**
   * Lấy danh sách dịch vụ
   * @returns {Promise} Services list
   */
  async getServices() {
    return await apiClient.get(SERVICE_ENDPOINTS.SERVICES);
  }

  /**
   * Tạo dịch vụ mới
   * @param {Object} serviceData - Dữ liệu dịch vụ
   * @returns {Promise} Created service
   */
  async createService(serviceData) {
    // Set default values
    const dataToSend = {
      ...serviceData,
      duocBaoHiem: 0, // Hidden field, default 0
      tyLeBaoHiem: 0, // Hidden field, default 0
      trangThai: 1, // Fixed to 1
    };

    return await apiClient.post(SERVICE_ENDPOINTS.SERVICES, dataToSend);
  }

  /**
   * Xóa dịch vụ
   * @param {string} maDichVu - Mã dịch vụ cần xóa
   * @returns {Promise} Delete result
   */
  async deleteService(maDichVu) {
    return await apiClient.delete(SERVICE_ENDPOINTS.DELETE_SERVICE(maDichVu));
  }

  /**
   * Cập nhật dịch vụ
   * @param {string} maDichVu - Mã dịch vụ cần cập nhật
   * @param {Object} serviceData - Dữ liệu cập nhật
   * @returns {Promise} Update result
   */
  async updateService(maDichVu, serviceData) {
    // Set default values
    const dataToSend = {
      ...serviceData,
      duocBaoHiem: serviceData.duocBaoHiem || 0,
      tyLeBaoHiem: serviceData.tyLeBaoHiem || 0,
      trangThai: 1,
    };

    return await apiClient.put(
      SERVICE_ENDPOINTS.DELETE_SERVICE(maDichVu),
      dataToSend
    );
  }
}

export default new ServiceService();
