/**
 * Groups API - /api/groups/*
 */

import { apiClient } from './client';
import type {
  ApiResponse,
  GroupDto,
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupMemberDto,
  ChecklistItemDto,
  CreateChecklistItemRequest,
  ToggleChecklistItemRequest,
  PollDto,
  CreatePollRequest,
  VotePollRequest,
} from './types';

export const groupsApi = {
  // ===== Groups CRUD =====

  /** GET /api/groups */
  getAll: (): Promise<ApiResponse<GroupDto[]>> =>
    apiClient.get<GroupDto[]>('/groups'),

  /** GET /api/groups/:id */
  getById: (id: string): Promise<ApiResponse<GroupDto>> =>
    apiClient.get<GroupDto>(`/groups/${id}`),

  /** POST /api/groups */
  create: (data: CreateGroupRequest): Promise<ApiResponse<GroupDto>> =>
    apiClient.post<GroupDto>('/groups', data),

  /** PUT /api/groups/:id */
  update: (id: string, data: UpdateGroupRequest): Promise<ApiResponse<GroupDto>> =>
    apiClient.put<GroupDto>(`/groups/${id}`, data),

  /** DELETE /api/groups/:id */
  delete: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/groups/${id}`),

  // ===== Members =====

  /** POST /api/groups/:id/members */
  addMember: (groupId: string, userId: string): Promise<ApiResponse<GroupMemberDto>> =>
    apiClient.post<GroupMemberDto>(`/groups/${groupId}/members`, { userId }),

  /** DELETE /api/groups/:id/members/:userId */
  removeMember: (groupId: string, userId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/groups/${groupId}/members/${userId}`),

  // ===== Checklist =====

  /** GET /api/groups/:id/checklist */
  getChecklist: (groupId: string): Promise<ApiResponse<ChecklistItemDto[]>> =>
    apiClient.get<ChecklistItemDto[]>(`/groups/${groupId}/checklist`),

  /** POST /api/groups/:id/checklist */
  addChecklistItem: (groupId: string, data: CreateChecklistItemRequest): Promise<ApiResponse<ChecklistItemDto>> =>
    apiClient.post<ChecklistItemDto>(`/groups/${groupId}/checklist`, data),

  /** PATCH /api/groups/:id/checklist/:itemId */
  toggleChecklistItem: (groupId: string, itemId: string, data: ToggleChecklistItemRequest): Promise<ApiResponse<ChecklistItemDto>> =>
    apiClient.patch<ChecklistItemDto>(`/groups/${groupId}/checklist/${itemId}`, data),

  /** DELETE /api/groups/:id/checklist/:itemId */
  deleteChecklistItem: (groupId: string, itemId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/groups/${groupId}/checklist/${itemId}`),

  // ===== Polls =====

  /** GET /api/groups/:id/polls */
  getPolls: (groupId: string): Promise<ApiResponse<PollDto[]>> =>
    apiClient.get<PollDto[]>(`/groups/${groupId}/polls`),

  /** POST /api/groups/:id/polls */
  createPoll: (groupId: string, data: CreatePollRequest): Promise<ApiResponse<PollDto>> =>
    apiClient.post<PollDto>(`/groups/${groupId}/polls`, data),

  /** POST /api/groups/:id/polls/:pollId/vote */
  votePoll: (groupId: string, pollId: string, data: VotePollRequest): Promise<ApiResponse<null>> =>
    apiClient.post<null>(`/groups/${groupId}/polls/${pollId}/vote`, data),

  /** DELETE /api/groups/:id/polls/:pollId */
  deletePoll: (groupId: string, pollId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/groups/${groupId}/polls/${pollId}`),
};
