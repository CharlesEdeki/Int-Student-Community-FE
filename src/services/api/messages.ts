/**
 * Messages API - /api/groups/:groupId/messages/*
 */

import { apiClient } from './client';
import type { ApiResponse, MessageDto, SendMessageRequest } from './types';

export const messagesApi = {
  /** GET /api/groups/:groupId/messages */
  getGroupMessages: (groupId: string, limit = 50, offset = 0): Promise<ApiResponse<MessageDto[]>> =>
    apiClient.get<MessageDto[]>(`/groups/${groupId}/messages`, { params: { limit, offset } }),

  /** POST /api/groups/:groupId/messages */
  send: (groupId: string, data: SendMessageRequest): Promise<ApiResponse<MessageDto>> =>
    apiClient.post<MessageDto>(`/groups/${groupId}/messages`, data),

  /** POST /api/groups/:groupId/messages/:messageId/reactions */
  addReaction: (groupId: string, messageId: string, emoji: string): Promise<ApiResponse<null>> =>
    apiClient.post<null>(`/groups/${groupId}/messages/${messageId}/reactions`, { emoji }),

  /** DELETE /api/groups/:groupId/messages/:messageId/reactions/:emoji */
  removeReaction: (groupId: string, messageId: string, emoji: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/groups/${groupId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`),

  /** DELETE /api/groups/:groupId/messages/:messageId */
  delete: (groupId: string, messageId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/groups/${groupId}/messages/${messageId}`),
};
