/**
 * Users API - /api/users/*
 */

import { apiClient } from './client';
import type { ApiResponse, UserDto, UpdateUserRequest, CompleteProfileRequest } from './types';

export const usersApi = {
  /** GET /api/users */
  getAll: (): Promise<ApiResponse<UserDto[]>> =>
    apiClient.get<UserDto[]>('/users'),

  /** GET /api/users/:id */
  getById: (id: string): Promise<ApiResponse<UserDto>> =>
    apiClient.get<UserDto>(`/users/${id}`),

  /** PUT /api/users/:id */
  update: (id: string, data: UpdateUserRequest): Promise<ApiResponse<UserDto>> =>
    apiClient.put<UserDto>(`/users/${id}`, data),

  /** DELETE /api/users/:id */
  delete: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/users/${id}`),

  /** POST /api/users/:id/onboarding */
  completeOnboarding: (id: string, data: CompleteProfileRequest): Promise<ApiResponse<UserDto>> =>
    apiClient.post<UserDto>(`/users/${id}/onboarding`, data),

  /** GET /api/users/:id/groups */
  getUserGroups: (userId: string) =>
    apiClient.get(`/users/${userId}/groups`),

  /** GET /api/users/:id/events */
  getUserEvents: (userId: string) =>
    apiClient.get(`/users/${userId}/events`),

  /** GET /api/users/:id/notifications */
  getUserNotifications: (userId: string) =>
    apiClient.get(`/users/${userId}/notifications`),
};
