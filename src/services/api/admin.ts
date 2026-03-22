/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface GroupStatsResponse {
  groupRotationData: any;
  participationMetrics: any;
}

export const adminApi = {
  // ===== User Management =====
  /** GET /api/Users - Get all users */
  getUsers: (): Promise<ApiResponse<UserDto[]>> =>
    apiClient.get<UserDto[]>('/Users'),

  /** GET /api/Users/{id} - Get user by ID */
  getUserById: (id: string): Promise<ApiResponse<UserDto>> =>
    apiClient.get<UserDto>(`/Users/${id}`),

  /** PUT /api/Users/{id} - Update user */
  updateUser: (id: string, data: Partial<UserDto>): Promise<ApiResponse<UserDto>> =>
    apiClient.put<UserDto>(`/Users/${id}`, data),

  /** DELETE /api/Users/{id} - Delete/Remove user */
  removeUser: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Users/${id}`),

  /** GET /api/Users/{id}/groups - Get user's groups */
  getUserGroups: (id: string): Promise<ApiResponse<GroupDto[]>> =>
    apiClient.get<GroupDto[]>(`/Users/${id}/groups`),

  /** GET /api/Users/{id}/events - Get user's events */
  getUserEvents: (id: string): Promise<ApiResponse<EventDto[]>> =>
    apiClient.get<EventDto[]>(`/Users/${id}/events`),

  /** GET /api/Users/{id}/notifications - Get user notifications */
  getUserNotifications: (id: string): Promise<ApiResponse<any[]>> =>
    apiClient.get<any[]>(`/Users/${id}/notifications`),

  /** POST /api/Users/{id}/notifications/read-all - Mark notifications as read */
  markNotificationsRead: (id: string): Promise<ApiResponse<null>> =>
    apiClient.post<null>(`/Users/${id}/notifications/read-all`, {}),

  // ===== Event Management =====
  /** GET /api/Events - Get all events */
  getEvents: (): Promise<ApiResponse<EventDto[]>> =>
    apiClient.get<EventDto[]>('/Events'),

  /** POST /api/Events - Create event */
  createEvent: (data: Partial<EventDto>): Promise<ApiResponse<EventDto>> =>
    apiClient.post<EventDto>('/Events', data),

  /** GET /api/Events/{id} - Get event by ID */
  getEventById: (id: string): Promise<ApiResponse<EventDto>> =>
    apiClient.get<EventDto>(`/Events/${id}`),

  /** PUT /api/Events/{id} - Update event */
  updateEvent: (id: string, data: Partial<EventDto>): Promise<ApiResponse<EventDto>> =>
    apiClient.put<EventDto>(`/Events/${id}`, data),

  /** DELETE /api/Events/{id} - Delete event */
  deleteEvent: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Events/${id}`),

  /** GET /api/Events/{id}/attendees - Get event attendees */
  getEventAttendees: (id: string): Promise<ApiResponse<UserDto[]>> =>
    apiClient.get<UserDto[]>(`/Events/${id}/attendees`),

  // ===== Group Management =====
  /** GET /api/Groups - Get all groups */
  getGroups: (): Promise<ApiResponse<GroupDto[]>> =>
    apiClient.get<GroupDto[]>('/Groups'),

  /** POST /api/Groups - Create group */
  createGroup: (data: Partial<GroupDto>): Promise<ApiResponse<GroupDto>> =>
    apiClient.post<GroupDto>('/Groups', data),

  /** GET /api/Groups/{id} - Get group by ID */
  getGroupById: (id: string): Promise<ApiResponse<GroupDto>> =>
    apiClient.get<GroupDto>(`/Groups/${id}`),

  /** PUT /api/Groups/{id} - Update group */
  updateGroup: (id: string, data: Partial<GroupDto>): Promise<ApiResponse<GroupDto>> =>
    apiClient.put<GroupDto>(`/Groups/${id}`, data),

  /** DELETE /api/Groups/{id} - Delete group */
  deleteGroup: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Groups/${id}`),

  /** GET /api/Groups/{id}/members - Get group members */
  getGroupMembers: (id: string): Promise<ApiResponse<UserDto[]>> =>
    apiClient.get<UserDto[]>(`/Groups/${id}/members`),

  /** POST /api/Groups/{id}/members/{userId} - Add member to group */
  addGroupMember: (groupId: string, userId: string): Promise<ApiResponse<null>> =>
    apiClient.post<null>(`/Groups/${groupId}/members/${userId}`, {}),

  /** DELETE /api/Groups/{id}/members/{userId} - Remove member from group */
  removeGroupMember: (groupId: string, userId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Groups/${groupId}/members/${userId}`),

  // ===== Announcement Management =====
  /** GET /api/Announcements - Get all announcements */
  getAnnouncements: (): Promise<ApiResponse<AnnouncementDto[]>> =>
    apiClient.get<AnnouncementDto[]>('/Announcements'),

  /** POST /api/Announcements - Create announcement */
  createAnnouncement: (data: Partial<AnnouncementDto>): Promise<ApiResponse<AnnouncementDto>> =>
    apiClient.post<AnnouncementDto>('/Announcements', data),

  /** GET /api/Announcements/{id} - Get announcement by ID */
  getAnnouncementById: (id: string): Promise<ApiResponse<AnnouncementDto>> =>
    apiClient.get<AnnouncementDto>(`/Announcements/${id}`),

  /** PUT /api/Announcements/{id} - Update announcement */
  updateAnnouncement: (id: string, data: Partial<AnnouncementDto>): Promise<ApiResponse<AnnouncementDto>> =>
    apiClient.put<AnnouncementDto>(`/Announcements/${id}`, data),

  /** DELETE /api/Announcements/{id} - Delete announcement */
  deleteAnnouncement: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Announcements/${id}`),

  // ===== Admin Operations =====
  /** POST /api/Admin/trigger-group-rotation - Trigger group member rotation */
  triggerGroupRotation: (): Promise<ApiResponse<any>> =>
    apiClient.post<any>('/Admin/trigger-group-rotation', {}),

  /** GET /api/Admin/group-stats - Get group statistics */
  getGroupStats: (): Promise<ApiResponse<GroupStatsResponse>> =>
    apiClient.get<GroupStatsResponse>('/Admin/group-stats'),
};
