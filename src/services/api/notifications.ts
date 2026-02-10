/**
 * Notifications API - /api/notifications/*
 */

import { apiClient } from './client';
import type { ApiResponse, NotificationDto } from './types';

export const notificationsApi = {
  /** GET /api/users/:userId/notifications */
  getAll: (userId: string): Promise<ApiResponse<NotificationDto[]>> =>
    apiClient.get<NotificationDto[]>(`/users/${userId}/notifications`),

  /** PATCH /api/notifications/:id */
  markAsRead: (notificationId: string): Promise<ApiResponse<NotificationDto>> =>
    apiClient.patch<NotificationDto>(`/notifications/${notificationId}`, { read: true }),

  /** POST /api/users/:userId/notifications/read-all */
  markAllAsRead: (userId: string): Promise<ApiResponse<null>> =>
    apiClient.post<null>(`/users/${userId}/notifications/read-all`),

  /** DELETE /api/notifications/:id */
  delete: (notificationId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/notifications/${notificationId}`),
};
