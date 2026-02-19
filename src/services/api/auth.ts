/**
 * Authentication API - POST /api/auth/*
 */

import { apiClient, tokenManager } from './client';
import type { ApiResponse, AuthResponse, AuthTokens, LoginRequest, RegisterRequest } from './types';

export const authApi = {
  /** POST /api/Auth/register */
  register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post<AuthResponse>('/Auth/register', data, { skipAuth: true }),

  /** POST /api/Auth/login */
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post<AuthResponse>('/Auth/login', data, { skipAuth: true }),

  /** POST /api/Auth/refresh */
  refresh: (refreshToken: string): Promise<ApiResponse<AuthTokens>> =>
    apiClient.post<AuthTokens>('/Auth/refresh', { refreshToken }, { skipAuth: true }),

  /** POST /api/Auth/logout */
  logout: (): Promise<ApiResponse<null>> =>
    apiClient.post<null>('/Auth/logout'),

  /** POST /api/Auth/change-password */
  changePassword: (currentPassword: string, newPassword: string): Promise<ApiResponse<null>> =>
    apiClient.post<null>('/Auth/change-password', { currentPassword, newPassword }),

  /** POST /api/Auth/forgot-password */
  forgotPassword: (email: string): Promise<ApiResponse<null>> =>
    apiClient.post<null>('/Auth/forgot-password', { email }, { skipAuth: true }),

  /** POST /api/Auth/reset-password */
  resetPassword: (token: string, newPassword: string): Promise<ApiResponse<null>> =>
    apiClient.post<null>('/Auth/reset-password', { token, newPassword }, { skipAuth: true }),

  /** POST /api/Auth/verify-email */
  verifyEmail: (token: string): Promise<ApiResponse<null>> =>
    apiClient.post<null>('/Auth/verify-email', { token }, { skipAuth: true }),

  /** POST /api/Auth/resend-verification */
  resendVerification: (email: string): Promise<ApiResponse<null>> =>
    apiClient.post<null>('/Auth/resend-verification', { email }, { skipAuth: true }),

  // Token helpers
  saveTokens: (tokens: AuthTokens) => tokenManager.setTokens(tokens),
  clearTokens: () => tokenManager.clearTokens(),
  getAccessToken: () => tokenManager.getAccessToken(),
};
