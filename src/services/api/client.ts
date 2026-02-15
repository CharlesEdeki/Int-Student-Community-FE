/**
 * HTTP Client for .NET Backend API
 * 
 * Handles authentication headers, token refresh, and error handling.
 */

import type { ApiResponse, AuthTokens } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-dotnet-api.azurewebsites.net/api';

const TOKEN_STORAGE_KEY = 'isc_auth_tokens';

// ===== Token Management =====

export const tokenManager = {
  getTokens(): AuthTokens | null {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  },

  clearTokens(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  getAccessToken(): string | null {
    return this.getTokens()?.accessToken ?? null;
  },
};

// ===== HTTP Client =====

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
};

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function refreshAccessToken(): Promise<boolean> {
  const tokens = tokenManager.getTokens();
  if (!tokens?.refreshToken) return false;

  try {
    const response = await fetch(buildUrl('/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (!response.ok) return false;

    const result: ApiResponse<AuthTokens> = await response.json();
    if (result.success && result.data) {
      tokenManager.setTokens(result.data);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { body, params, skipAuth = false, ...init } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(init.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = tokenManager.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions: RequestInit = {
    ...init,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  let response = await fetch(buildUrl(path, params), fetchOptions);

  // Handle 401 - attempt token refresh
  if (response.status === 401 && !skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken();
    }

    const refreshed = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (refreshed) {
      const newToken = tokenManager.getAccessToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
      }
      response = await fetch(buildUrl(path, params), { ...fetchOptions, headers });
    } else {
      tokenManager.clearTokens();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }

  const result: ApiResponse<T> = await response.json();
  return result;
}

// ===== Exported HTTP Methods =====

export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(path, { ...options, method: 'POST', body });
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(path, { ...options, method: 'PUT', body });
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(path, { ...options, method: 'PATCH', body });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(path, { ...options, method: 'DELETE' });
  },
};

export { API_BASE_URL };
