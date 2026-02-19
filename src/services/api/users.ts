/**
 * Users API - /api/users/*
 */

import { apiClient } from './client';
import type { ApiResponse, UserDto, UpdateUserRequest, CompleteProfileRequest } from './types';

export const usersApi = {
  /** GET /api/Users */
  getAll: (): Promise<ApiResponse<UserDto[]>> =>
    apiClient.get<UserDto[]>('/Users'),

  /** GET /api/Users/:id */
  getById: (id: string): Promise<ApiResponse<UserDto>> =>
    apiClient.get<UserDto>(`/Users/${id}`),

  /** PUT /api/Users/:id */
  update: (id: string, data: UpdateUserRequest): Promise<ApiResponse<UserDto>> =>
    apiClient.put<UserDto>(`/Users/${id}`, data),

  /** DELETE /api/Users/:id */
  delete: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Users/${id}`),

  /** POST /api/Users/:id/onboarding */
  completeOnboarding: (id: string, data: CompleteProfileRequest): Promise<ApiResponse<UserDto>> =>
    apiClient.post<UserDto>(`/Users/${id}/onboarding`, data),

  /** GET /api/Users/:id/groups */
  getUserGroups: (userId: string) =>
    apiClient.get(`/Users/${userId}/groups`),

  /** GET /api/Users/:id/events */
  getUserEvents: (userId: string) =>
    apiClient.get(`/Users/${userId}/events`),

  /** GET /api/Users/:id/notifications */
  getUserNotifications: (userId: string) =>
    apiClient.get(`/Users/${userId}/notifications`),
};
