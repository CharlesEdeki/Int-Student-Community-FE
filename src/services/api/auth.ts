/**
 * Authentication API - POST /api/auth/*
 */

import { apiClient, tokenManager } from './client';
import type { ApiResponse, AuthResponse, AuthTokens, LoginRequest, RegisterRequest } from './types';

export const authApi = {
  /** POST /api/auth/register */
  register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post<AuthResponse>('/auth/register', data, { skipAuth: true }),

  /** POST /api/auth/login */
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post<AuthResponse>('/auth/login', data, { skipAuth: true }),

  /** POST /api/auth/refresh */
  refresh: (refreshToken: string): Promise<ApiResponse<AuthTokens>> =>
    apiClient.post<AuthTokens>('/auth/refresh', { refreshToken }, { skipAuth: true }),

  /** POST /api/auth/logout */
  logout: (): Promise<ApiResponse<null>> =>
    apiClient.post<null>('/auth/logout'),

  // Token helpers
  saveTokens: (tokens: AuthTokens) => tokenManager.setTokens(tokens),
  clearTokens: () => tokenManager.clearTokens(),
  getAccessToken: () => tokenManager.getAccessToken(),
};
