/**
 * Profile API - /api/Profile/user/*
 */

import { apiClient } from './client';
import type { ApiResponse, UserDto, UpdateUserRequest } from './types';

export const profileApi = {
  /** POST /api/Profile/user/:userId */
  create: (userId: string, data: UpdateUserRequest): Promise<ApiResponse<UserDto>> =>
    apiClient.post<UserDto>(`/Profile/user/${userId}`, data),

  /** GET /api/Profile/user/:userId */
  getProfile: (userId: string): Promise<ApiResponse<UserDto>> =>
    apiClient.get<UserDto>(`/Profile/user/${userId}`),

  /** PUT /api/Profile/user/:userId */
  updateProfile: (userId: string, data: UpdateUserRequest): Promise<ApiResponse<UserDto>> =>
    apiClient.put<UserDto>(`/Profile/user/${userId}`, data),

  /** DELETE /api/Profile/user/:userId */
  deleteProfile: (userId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Profile/user/${userId}`),
};
