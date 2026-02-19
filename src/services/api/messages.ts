/**
 * Messages API - /api/Groups/:groupId/messages/*
 */

import { apiClient } from './client';
import type { ApiResponse, MessageDto, SendMessageRequest } from './types';

export const messagesApi = {
  /** GET /api/Groups/:groupId/messages */
  getGroupMessages: (groupId: string, limit = 50, offset = 0): Promise<ApiResponse<MessageDto[]>> =>
    apiClient.get<MessageDto[]>(`/Groups/${groupId}/messages`, { params: { limit, offset } }),

  /** POST /api/Groups/:groupId/messages */
  send: (groupId: string, data: SendMessageRequest): Promise<ApiResponse<MessageDto>> =>
    apiClient.post<MessageDto>(`/Groups/${groupId}/messages`, data),

  /** POST /api/Groups/:groupId/messages/:messageId/reactions */
  addReaction: (groupId: string, messageId: string, emoji: string): Promise<ApiResponse<null>> =>
    apiClient.post<null>(`/Groups/${groupId}/messages/${messageId}/reactions`, { emoji }),

  /** DELETE /api/Groups/:groupId/messages/:messageId/reactions/:emoji */
  removeReaction: (groupId: string, messageId: string, emoji: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Groups/${groupId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`),

  /** DELETE /api/Groups/:groupId/messages/:messageId */
  delete: (groupId: string, messageId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Groups/${groupId}/messages/${messageId}`),
};
