/**
 * Admin API - admin-specific endpoints
 */

import { apiClient } from './client';
import type { ApiResponse, UserDto, EventDto, GroupDto, AnnouncementDto } from './types';

export interface AdminStats {
  totalUsers: number;
  totalGroups: number;
  upcomingEvents: number;
  pastEvents: number;
}

export interface AdminUserDto {
  id: string;
  name: string;
  email: string;
  country: string | null;
  campus: string | null;
  groupCount: number;
  joinedAt: string;
  status: 'Active' | 'Blocked' | 'Inactive';
  isOnline: boolean;
}

export const adminApi = {
  /** GET /api/Users - Get all users for admin */
  getUsers: (): Promise<ApiResponse<UserDto[]>> =>
    apiClient.get<UserDto[]>('/Users'),

  /** DELETE /api/Users/:id */
  removeUser: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Users/${id}`),

  /** GET /api/events - Get all events */
  getEvents: (): Promise<ApiResponse<EventDto[]>> =>
    apiClient.get<EventDto[]>('/events'),

  /** DELETE /api/events/:id */
  deleteEvent: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/events/${id}`),

  /** POST /api/events */
  createEvent: (data: any): Promise<ApiResponse<EventDto>> =>
    apiClient.post<EventDto>('/events', data),

  /** GET /api/groups - Get all groups */
  getGroups: (): Promise<ApiResponse<GroupDto[]>> =>
    apiClient.get<GroupDto[]>('/groups'),

  /** GET /api/announcements */
  getAnnouncements: (): Promise<ApiResponse<AnnouncementDto[]>> =>
    apiClient.get<AnnouncementDto[]>('/announcements'),

  /** POST /api/announcements */
  createAnnouncement: (data: any): Promise<ApiResponse<AnnouncementDto>> =>
    apiClient.post<AnnouncementDto>('/announcements', data),

  /** DELETE /api/announcements/:id */
  deleteAnnouncement: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/announcements/${id}`),
};
