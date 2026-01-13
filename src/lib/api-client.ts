/**
 * API Client - Hàm gọi API đơn giản và dễ sử dụng
 * Sử dụng: apiClient.get('/api/users'), apiClient.post('/api/users', { name: 'John' })
 */

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
};

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Thêm token vào header (dùng khi đã login)
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Xóa token
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Hàm gọi API chung
  private async request<T>(
    endpoint: string,
    method: string,
    options?: RequestOptions
  ): Promise<T> {
    const url = new URL(endpoint, this.baseURL || window.location.origin);

    // Thêm query params nếu có
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const config: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
    };

    // Thêm body nếu không phải GET
    if (options?.body && method !== 'GET') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url.toString(), config);

      // Xử lý lỗi HTTP
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));
        throw new Error(error.message || 'Request failed');
      }

      // Trả về data
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  get<T>(endpoint: string, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>(endpoint, 'GET', options);
  }

  // POST request
  post<T>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, 'POST', { ...options, body });
  }

  // PUT request
  put<T>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, 'PUT', { ...options, body });
  }

  // PATCH request
  patch<T>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, 'PATCH', { ...options, body });
  }

  // DELETE request
  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, 'DELETE', options);
  }
}

// Export instance để sử dụng trong toàn bộ app
export const apiClient = new ApiClient();
