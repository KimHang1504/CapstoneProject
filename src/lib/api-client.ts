/**
 * API Client - Hàm gọi API đơn giản và dễ sử dụng
 * Sử dụng: apiClient.get('/api/users'), apiClient.post('/api/users', { name: 'John' })
 */

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>
  body?: any;
};

// response chung của BE
export type ApiResponse<T> = {
  message: string;
  code: number;
  data: T;
  traceId: string;
  timestamp: string;
};

class ApiClient {
  private NEXT_PUBLIC_API_URL: string;
  private defaultHeaders: Record<string, string>;
  private hasTriggeredForceLogout = false;

  constructor(baseURL = '') {
    this.NEXT_PUBLIC_API_URL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    // if (typeof window !== "undefined" && DEV_ACCESS_TOKEN) {
    //   this.defaultHeaders["Authorization"] = `Bearer ${DEV_ACCESS_TOKEN}`;
    // }
  }

  // Thêm token vào header (dùng khi đã login)
  setAuthToken(token: string) {
    localStorage.setItem("access_token", token);
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Xóa token
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  }

  private forceLogout() {
    if (typeof window === "undefined" || this.hasTriggeredForceLogout) {
      return;
    }

    this.hasTriggeredForceLogout = true;
    this.clearAuthToken();
    document.cookie = "accessToken=; path=/; max-age=0";

    if (!window.location.pathname.startsWith("/auth")) {
      window.location.replace("/auth");
    }
  }

  private isLockedAccountMessage(message: string) {
    const normalized = message.toLowerCase();
    return (
      normalized.includes("tài khoản đã bị khóa") ||
      normalized.includes("tai khoan da bi khoa") ||
      normalized.includes("inactive") ||
      normalized.includes("locked") ||
      normalized.includes("bị khóa")
    );
  }

  // Hàm gọi API chung
  private async request<T>(
    endpoint: string,
    method: string,
    options?: RequestOptions
  ): Promise<T> {
    const url = new URL(endpoint, this.NEXT_PUBLIC_API_URL);

    // Thêm query params nếu có
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    let token: string | null = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem("access_token");
    } else {
      const { cookies } = await import("next/headers");
      token = (await cookies()).get("accessToken")?.value ?? null;
    }

    const config: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      }
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
        const errorMessage = String(error?.message || response.statusText || 'Request failed');

        if (response.status === 401 && this.isLockedAccountMessage(errorMessage)) {
          this.forceLogout();
        }

        throw new Error(errorMessage);
      }

      // Trả về data
      const data = await response.json();

      if (
        endpoint.toLowerCase().includes('/api/auth/me') &&
        data?.data?.isActive === false
      ) {
        this.forceLogout();
        throw new Error('Tài khoản đã bị khóa');
      }

      return data;
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

  //upload ảnh
  async uploadFile<T>(endpoint: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const response = await fetch(
      new URL(endpoint, this.NEXT_PUBLIC_API_URL).toString(),
      {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));

      const customError: any = new Error(error.message || "Upload failed");
      customError.data = error;
      customError.status = response.status;

      throw customError;
    }

    return response.json();
  }
}




// Export instance để sử dụng trong toàn bộ app
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL
);