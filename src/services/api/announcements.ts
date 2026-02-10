/**
 * Announcements API - /api/announcements/*
 */

import { apiClient } from './client';
import type { ApiResponse, AnnouncementDto, CreateAnnouncementRequest, UpdateAnnouncementRequest } from './types';

export const announcementsApi = {
  /** GET /api/announcements */
  getAll: (): Promise<ApiResponse<AnnouncementDto[]>> =>
    apiClient.get<AnnouncementDto[]>('/announcements'),

  /** GET /api/announcements/:id */
  getById: (id: string): Promise<ApiResponse<AnnouncementDto>> =>
    apiClient.get<AnnouncementDto>(`/announcements/${id}`),

  /** POST /api/announcements */
  create: (data: CreateAnnouncementRequest): Promise<ApiResponse<AnnouncementDto>> =>
    apiClient.post<AnnouncementDto>('/announcements', data),

  /** PUT /api/announcements/:id */
  update: (id: string, data: UpdateAnnouncementRequest): Promise<ApiResponse<AnnouncementDto>> =>
    apiClient.put<AnnouncementDto>(`/announcements/${id}`, data),

  /** DELETE /api/announcements/:id */
  delete: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/announcements/${id}`),
};
