/**
 * Notifications API - /api/notifications/*
 */

import { apiClient } from './client';
import type { ApiResponse, NotificationDto } from './types';

export const notificationsApi = {
  /** GET /api/Users/:userId/notifications */
  getAll: (userId: string): Promise<ApiResponse<NotificationDto[]>> =>
    apiClient.get<NotificationDto[]>(`/Users/${userId}/notifications`),

  /** PATCH /api/Notifications/:id */
  markAsRead: (notificationId: string): Promise<ApiResponse<NotificationDto>> =>
    apiClient.patch<NotificationDto>(`/Notifications/${notificationId}`, { read: true }),

  /** POST /api/Users/:userId/notifications/read-all */
  markAllAsRead: (userId: string): Promise<ApiResponse<null>> =>
    apiClient.post<null>(`/Users/${userId}/notifications/read-all`),

  /** DELETE /api/Notifications/:id */
  delete: (notificationId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Notifications/${notificationId}`),
};
