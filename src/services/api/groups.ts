/**
 * Groups API - /api/groups/*
 */

import { apiClient } from './client';
import type {
  ApiResponse,
  GroupDto,
  UserGroupsResponse,
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

  /** GET /api/Users/:userId/groups - Get groups for a specific user */
  getAll: (userId?: string): Promise<ApiResponse<UserGroupsResponse>> => {
    if (userId) {
      return apiClient.get<UserGroupsResponse>(`/Users/${userId}/groups`);
    }
    // Fallback - this may not work as expected
    return apiClient.get<UserGroupsResponse>('/Groups');
  },

  /** GET /api/Groups/:id */
  getById: (id: string): Promise<ApiResponse<GroupDto>> =>
    apiClient.get<GroupDto>(`/Groups/${id}`),

  /** POST /api/Users/:userId/groups - Add user to group (managed via onboarding) */
  create: (userId: string, data: CreateGroupRequest): Promise<ApiResponse<GroupDto>> =>
    apiClient.post<GroupDto>(`/Users/${userId}/groups`, data),

  /** PUT /api/Groups/:id */
  update: (id: string, data: UpdateGroupRequest): Promise<ApiResponse<GroupDto>> =>
    apiClient.put<GroupDto>(`/Groups/${id}`, data),

  /** DELETE /api/Groups/:id */
  delete: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Groups/${id}`),

  // ===== Members =====

  /** GET /api/Groups/:id/members */
  getMembers: (groupId: string): Promise<ApiResponse<GroupMemberDto[]>> =>
    apiClient.get<GroupMemberDto[]>(`/Groups/${groupId}/members`),

  /** POST /api/Groups/:id/members */
  addMember: (groupId: string, userId: string): Promise<ApiResponse<GroupMemberDto>> =>
    apiClient.post<GroupMemberDto>(`/Groups/${groupId}/members`, { userId }),

  /** DELETE /api/Groups/:id/members/:userId */
  removeMember: (groupId: string, userId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Groups/${groupId}/members/${userId}`),

  // ===== Checklist =====

  /** GET /api/Groups/:id/checklist */
  getChecklist: (groupId: string): Promise<ApiResponse<ChecklistItemDto[]>> =>
    apiClient.get<ChecklistItemDto[]>(`/Groups/${groupId}/checklist`),

  /** POST /api/Groups/:id/checklist */
  addChecklistItem: (groupId: string, data: CreateChecklistItemRequest): Promise<ApiResponse<ChecklistItemDto>> =>
    apiClient.post<ChecklistItemDto>(`/Groups/${groupId}/checklist`, data),

  /** PATCH /api/Groups/:id/checklist/:itemId */
  toggleChecklistItem: (groupId: string, itemId: string, data: ToggleChecklistItemRequest): Promise<ApiResponse<ChecklistItemDto>> =>
    apiClient.patch<ChecklistItemDto>(`/Groups/${groupId}/checklist/${itemId}`, data),

  /** DELETE /api/Groups/:id/checklist/:itemId */
  deleteChecklistItem: (groupId: string, itemId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Groups/${groupId}/checklist/${itemId}`),

  // ===== Polls =====

  /** GET /api/Groups/:id/polls */
  getPolls: (groupId: string): Promise<ApiResponse<PollDto[]>> =>
    apiClient.get<PollDto[]>(`/Groups/${groupId}/polls`),

  /** POST /api/Groups/:id/polls */
  createPoll: (groupId: string, data: CreatePollRequest): Promise<ApiResponse<PollDto>> =>
    apiClient.post<PollDto>(`/Groups/${groupId}/polls`, data),

  /** POST /api/Groups/:id/polls/:pollId/vote */
  votePoll: (groupId: string, pollId: string, data: VotePollRequest): Promise<ApiResponse<null>> =>
    apiClient.post<null>(`/Groups/${groupId}/polls/${pollId}/vote`, data),

  /** DELETE /api/Groups/:id/polls/:pollId */
  deletePoll: (groupId: string, pollId: string): Promise<ApiResponse<null>> =>
    apiClient.delete<null>(`/Groups/${groupId}/polls/${pollId}`),
};
