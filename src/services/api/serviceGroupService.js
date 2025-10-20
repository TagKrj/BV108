/**
 * Service Group Service
 * Service xử lý các API liên quan đến nhóm dịch vụ
 */

import apiClient from "./apiClient";

const SERVICE_GROUP_ENDPOINTS = {
  SERVICE_GROUPS: "/nhomdichvu",
  DELETE_SERVICE_GROUP: (maNhomDichVu) => `/nhomdichvu/${maNhomDichVu}`,
};

class ServiceGroupService {
  /**
   * Lấy danh sách nhóm dịch vụ
   * @returns {Promise} Service groups list
   */
  async getServiceGroups() {
    return await apiClient.get(SERVICE_GROUP_ENDPOINTS.SERVICE_GROUPS);
  }

  /**
   * Tạo nhóm dịch vụ mới
   * @param {Object} serviceGroupData - Dữ liệu nhóm dịch vụ {maNhomDichVu, tenNhomDichVu, moTa}
   * @returns {Promise} Created service group
   */
  async createServiceGroup(serviceGroupData) {
    // Luôn set trangThai = 1
    const dataToSend = {
      ...serviceGroupData,
      trangThai: 1,
    };

    return await apiClient.post(
      SERVICE_GROUP_ENDPOINTS.SERVICE_GROUPS,
      dataToSend
    );
  }

  /**
   * Xóa nhóm dịch vụ
   * @param {string} maNhomDichVu - Mã nhóm dịch vụ cần xóa
   * @returns {Promise} Delete result
   */
  async deleteServiceGroup(maNhomDichVu) {
    return await apiClient.delete(
      SERVICE_GROUP_ENDPOINTS.DELETE_SERVICE_GROUP(maNhomDichVu)
    );
  }

  /**
   * Cập nhật nhóm dịch vụ
   * @param {string} maNhomDichVu - Mã nhóm dịch vụ cần cập nhật
   * @param {Object} serviceGroupData - Dữ liệu cập nhật {tenNhomDichVu, moTa}
   * @returns {Promise} Update result
   */
  async updateServiceGroup(maNhomDichVu, serviceGroupData) {
    // Luôn set trangThai = 1
    const dataToSend = {
      ...serviceGroupData,
      trangThai: 1,
    };

    return await apiClient.put(
      SERVICE_GROUP_ENDPOINTS.DELETE_SERVICE_GROUP(maNhomDichVu),
      dataToSend
    );
  }
}

export default new ServiceGroupService();
