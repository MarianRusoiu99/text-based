/**
 * Base HTTP client with error handling, authentication, and request/response interceptors
 */

import { API_BASE_URL } from './endpoints';
import type { ApiResponse } from './types';

// Custom error class for API errors
export class ApiException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly errorCode: string,
    message: string,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// HTTP client configuration
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

// Global authentication token storage
let accessToken: string | null = null;
let refreshToken: string | null = null;

// Token management
export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getAccessToken = (): string | null => {
  if (!accessToken) {
    accessToken = localStorage.getItem('accessToken');
  }
  return accessToken;
};

export const getRefreshToken = (): string | null => {
  if (!refreshToken) {
    refreshToken = localStorage.getItem('refreshToken');
  }
  return refreshToken;
};

// Create authenticated headers
const createAuthHeaders = (): Record<string, string> => {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Base HTTP client
export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 10000,
    } = config;

    const url = `${this.baseUrl}${endpoint}`;
    const requestHeaders = {
      ...createAuthHeaders(),
      ...headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      let responseData: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = responseData?.message || `HTTP ${response.status}: ${response.statusText}`;
        const errorCode = responseData?.errorCode || 'HTTP_ERROR';
        throw new ApiException(response.status, errorCode, errorMessage, responseData?.details);
      }

      // Return successful response
      return responseData;
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }

      // Handle network errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiException(408, 'TIMEOUT', 'Request timeout');
        }
        throw new ApiException(0, 'NETWORK_ERROR', error.message);
      }

      throw new ApiException(0, 'UNKNOWN_ERROR', 'An unknown error occurred');
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

// Default HTTP client instance
export const httpClient = new HttpClient();