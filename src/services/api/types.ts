/**
 * Shared API types matching .NET backend DTOs
 */

// ===== Common =====

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors: string[];
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ===== Auth =====

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

// Backend response structure for registration and login
export interface AuthResponse {
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  phoneCode: string | null;
  phoneNumber: string | null;
  token: string;
  userId: number;
}

// ===== Users =====

export interface UserDto {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  country: string | null;
  campus: string | null;
  major: string | null;
  year: string | null;
  bio: string | null;
  interests: string[];
  languages: string[];
  isOnline: boolean;
  createdAt: string;
}

export interface UserSummaryDto {
  id: string;
  name: string;
  avatarUrl: string | null;
  country: string | null;
  isOnline: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  avatarUrl?: string;
  country?: string;
  campus?: string;
  major?: string;
  year?: string;
  bio?: string;
  interests?: string[];
  languages?: string[];
}

export interface CompleteProfileRequest {
  country: string;
  campus: string;
  major: string;
  year: string;
  bio?: string;
  interests: string[];
  languages: string[];
}

// ===== Groups =====

export interface GroupDto {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
  isPrivate: boolean;
  memberCount: number;
  onlineCount?: number;
  createdAt: string;
}

export interface UserGroupsResponse {
  groups: GroupDto[];
  totalGroups: number;
  totalMemberCount: number;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  category: string;
  isPrivate?: boolean;
  memberIds?: string[];
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  category?: string;
  isPrivate?: boolean;
}

export interface GroupMemberDto {
  id: string;
  groupId: string;
  userId: string;
  role: 'Member' | 'Moderator' | 'Admin' | 'Owner';
  joinedAt: string;
  user: UserSummaryDto;
}

// ===== Events =====

export interface EventDto {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  isVirtual: boolean;
  virtualLink: string | null;
  maxAttendees: number | null;
  status: 'Draft' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  groupId: string | null;
  organizerId: string;
  attendeeCount?: number;
  createdAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  isVirtual?: boolean;
  virtualLink?: string;
  maxAttendees?: number;
  category?: string;
  groupId?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  isVirtual?: boolean;
  virtualLink?: string;
  maxAttendees?: number;
}

export interface EventAttendeeDto {
  id: string;
  eventId: string;
  userId: string;
  status: 'Going' | 'Interested' | 'NotGoing';
  registeredAt: string;
  user: UserSummaryDto;
}

// ===== Messages =====

export interface MessageDto {
  id: string;
  content: string;
  senderId: string;
  recipientId: string | null;
  groupId: string | null;
  isRead: boolean;
  readAt: string | null;
  isEdited: boolean;
  editedAt: string | null;
  isDeleted: boolean;
  sender: UserSummaryDto;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface ReactionRequest {
  emoji: string;
}

// ===== Polls =====

export interface PollDto {
  id: string;
  question: string;
  groupId: string;
  creatorId: string;
  isActive: boolean;
  expiresAt: string | null;
  allowMultipleVotes: boolean;
  options: PollOptionDto[];
  createdAt: string;
}

export interface PollOptionDto {
  id: string;
  pollId: string;
  text: string;
  voteCount: number;
}

export interface CreatePollRequest {
  question: string;
  options: { text: string }[];
}

export interface VotePollRequest {
  optionId: string;
}

// ===== Notifications =====

export interface NotificationDto {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string | null;
  isRead: boolean;
  readAt: string | null;
  data: string | null;
  createdAt: string;
}

// ===== Announcements =====

export interface AnnouncementDto {
  id: string;
  groupId: string;
  authorId: string;
  title: string;
  content: string;
  isPinned: boolean;
  author?: UserSummaryDto;
  createdAt: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  priority?: string;
}

export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
  priority?: string;
}

// ===== Checklist =====

export interface ChecklistItemDto {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface CreateChecklistItemRequest {
  title: string;
}

export interface ToggleChecklistItemRequest {
  completed: boolean;
}
