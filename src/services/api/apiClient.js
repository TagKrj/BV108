/**
 * API Client Configuration
 * Cấu hình client cho việc gọi API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Tạo headers mặc định cho request
 */
const getDefaultHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };

    // Lấy token từ localStorage nếu có
    const token = localStorage.getItem('accessToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

/**
 * Xử lý response từ API
 */
const handleResponse = async (response) => {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        // Xử lý các lỗi HTTP
        const error = {
            status: response.status,
            message: data?.message || response.statusText || 'Đã xảy ra lỗi',
            data: data
        };

        // Xử lý lỗi 401 - Unauthorized
        if (response.status === 401) {
            // Có thể redirect đến trang login
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }

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
            const headers = {};
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    ...headers,
                    ...options.headers
                },
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
