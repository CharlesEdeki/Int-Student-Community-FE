/**
 * API Service barrel export
 * 
 * Usage:
 *   import { authApi, usersApi, groupsApi } from '@/services/api';
 * 
 * Configure the backend URL via VITE_API_BASE_URL environment variable.
 */

export { authApi } from './auth';
export { usersApi } from './users';
export { groupsApi } from './groups';
export { eventsApi } from './events';
export { messagesApi } from './messages';
export { notificationsApi } from './notifications';
export { announcementsApi } from './announcements';

export { apiClient, tokenManager, API_BASE_URL } from './client';

// Re-export all types
export type * from './types';
