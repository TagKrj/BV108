/**
 * API Client Configuration
 * Cấu hình client cho việc gọi API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Tạo headers mặc định cho request
 */
const getDefaultHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420', // Bypass ngrok browser warning
    };
};

/**
 * Xử lý response từ API
 */
const handleResponse = async (response) => {
    // Kiểm tra content-type
    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
        data = await response.json().catch(() => null);
    } else {
        data = await response.text().catch(() => null);
    }

    if (!response.ok) {
        // Xử lý các lỗi HTTP
        const error = {
            status: response.status,
            message: data?.message || response.statusText || 'Đã xảy ra lỗi',
            data: data
        };
        throw error;
    }

    return data;
};

/**
 * API Client class
 */
class ApiClient {
    /**
     * GET request
     */
    async get(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    ...getDefaultHeaders(),
                    ...options.headers
                },
                ...options
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('GET request error:', error);
            throw error;
        }
    }

    /**
     * POST request
     */
    async post(endpoint, body, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    ...getDefaultHeaders(),
                    ...options.headers
                },
                body: JSON.stringify(body),
                ...options
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('POST request error:', error);
            throw error;
        }
    }

    /**
     * PUT request
     */
    async put(endpoint, body, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    ...getDefaultHeaders(),
                    ...options.headers
                },
                body: JSON.stringify(body),
                ...options
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('PUT request error:', error);
            throw error;
        }
    }

    /**
     * PATCH request
     */
    async patch(endpoint, body, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PATCH',
                headers: {
                    ...getDefaultHeaders(),
                    ...options.headers
                },
                body: JSON.stringify(body),
                ...options
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('PATCH request error:', error);
            throw error;
        }
    }

    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    ...getDefaultHeaders(),
                    ...options.headers
                },
                ...options
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('DELETE request error:', error);
            throw error;
        }
    }

    /**
     * Upload file
     */
    async upload(endpoint, formData, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                body: formData,
                ...options
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Upload request error:', error);
            throw error;
        }
    }
}

// Export singleton instance
export default new ApiClient();
