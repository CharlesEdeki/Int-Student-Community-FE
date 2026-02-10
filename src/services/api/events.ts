/**
 * Events API - /api/events/*
 */

import { apiClient } from './client';
import type { ApiResponse, EventDto, CreateEventRequest, UpdateEventRequest, EventAttendeeDto } from './types';

export const eventsApi = {
  /** GET /api/events */
  getAll: (category?: string): Promise<ApiResponse<EventDto[]>> =>
    apiClient.get<EventDto[]>('/events', { params: category ? { category } : undefined }),

  /** GET /api/events/:id */
  getById: (id: string): Promise<ApiResponse<EventDto>> =>
    apiClient.get<EventDto>(`/events/${id}`),

  /** POST /api/events */
  create: (data: CreateEventRequest): Promise<ApiResponse<EventDto>> =>
    apiClient.post<EventDto>('/events', data),

  /** PUT /api/events/:id */
  update: (id: string, data: UpdateEventRequest): Promise<ApiResponse<EventDto>> =>
    apiClient.put<EventDto>(`/events/${id}`, data),

  /** DELETE /api/events/:id */
  delete: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/events/${id}`),

  /** POST /api/events/:id/attendees - Join/RSVP */
  join: (eventId: string): Promise<ApiResponse<EventAttendeeDto>> =>
    apiClient.post<EventAttendeeDto>(`/events/${eventId}/attendees`),

  /** DELETE /api/events/:id/attendees - Leave */
  leave: (eventId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/events/${eventId}/attendees`),
};
