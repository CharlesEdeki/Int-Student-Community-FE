/**
 * API Service barrel export
 */

export { authApi } from './auth';
export { usersApi } from './users';
export { profileApi } from './profile';
export { groupsApi } from './groups';
export { eventsApi } from './events';
export { messagesApi } from './messages';
export { notificationsApi } from './notifications';
export { announcementsApi } from './announcements';

export { apiClient, tokenManager, API_BASE_URL } from './client';

// Re-export all types
export type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  AuthTokens,
  AuthResponse,
  UserDto,
  UserSummaryDto,
  UpdateUserRequest,
  CompleteProfileRequest,
  GroupDto,
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupMemberDto,
  EventDto,
  CreateEventRequest,
  UpdateEventRequest,
  EventAttendeeDto,
  MessageDto,
  SendMessageRequest,
  ReactionRequest,
  PollDto,
  PollOptionDto,
  CreatePollRequest,
  VotePollRequest,
  NotificationDto,
  AnnouncementDto,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  ChecklistItemDto,
  CreateChecklistItemRequest,
  ToggleChecklistItemRequest,
} from './types';
