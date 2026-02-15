import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { authApi } from '@/services/api/auth';
import { usersApi } from '@/services/api/users';
import { groupsApi } from '@/services/api/groups';
import { eventsApi } from '@/services/api/events';
import { messagesApi } from '@/services/api/messages';
import { notificationsApi } from '@/services/api/notifications';
import { announcementsApi } from '@/services/api/announcements';
import { tokenManager } from '@/services/api/client';
import type { UserDto, ApiResponse, CompleteProfileRequest, GroupDto, EventDto, MessageDto, NotificationDto, AnnouncementDto, AuthResponse } from '@/services/api/types';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  country: string;
  campus: string;
  major: string;
  year: string;
  bio: string;
  interests: string[];
  languages: string[];
  joinedAt: string;
  isOnline: boolean;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  votedBy: string[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
  expiresAt: string;
  iceBreakers: string[];
  checklist: ChecklistItem[];
  polls: Poll[];
}

export interface Reaction {
  emoji: string;
  users: string[];
}

export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  timestamp: string;
  reactions: Reaction[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: string;
  attendees: string[];
  maxAttendees: number;
  image: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  priority: string;
}

export interface OnboardingData {
  step: number;
  profile: {
    name: string;
    email: string;
    avatar: string;
    country: string;
    bio: string;
  };
  study: {
    campus: string;
    major: string;
    year: string;
  };
  interests: string[];
  preferences: {
    groupSize: string;
    matchingPreference: string;
    languages: string[];
    rotationPreference: 'rotate' | 'stay' | 'undecided';
  };
}

interface AppState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUser: User | null;
  users: User[];
  groups: Group[];
  messages: Message[];
  events: Event[];
  notifications: Notification[];
  announcements: Announcement[];
  onboardingData: OnboardingData;
  currentGroupId: string | null;
  rotationPreference: 'rotate' | 'stay' | 'undecided';
  loading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<ApiResponse<AuthResponse | null>>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<ApiResponse<AuthResponse | null>>;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => Promise<ApiResponse<UserDto | null>>;
  toggleAdmin: () => void;
  sendMessage: (groupId: string, content: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  toggleChecklistItem: (groupId: string, itemId: string) => Promise<void>;
  votePoll: (groupId: string, pollId: string, optionId: string) => Promise<void>;
  createEvent: (event: Omit<Event, 'id' | 'organizer' | 'attendees'>) => Promise<void>;
  rsvpEvent: (eventId: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  getUserById: (userId: string) => User | undefined;
  getGroupById: (groupId: string) => Group | undefined;
  getCurrentGroup: () => Group | undefined;
  createPoll: (groupId: string, question: string, options: string[]) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  setRotationPreference: (preference: 'rotate' | 'stay' | 'undecided') => void;
}

const defaultOnboardingData: OnboardingData = {
  step: 0,
  profile: { name: '', email: '', avatar: '', country: '', bio: '' },
  study: { campus: '', major: '', year: '' },
  interests: [],
  preferences: { groupSize: '', matchingPreference: '', languages: [], rotationPreference: 'undecided' },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    isAuthenticated: !!tokenManager.getAccessToken(),
    isAdmin: false,
    currentUser: null,
    users: [],
    groups: [],
    messages: [],
    events: [],
    notifications: [],
    announcements: [],
    onboardingData: defaultOnboardingData,
    currentGroupId: null,
    rotationPreference: 'undecided',
    loading: false,
    error: null,
  });

  // Helper to map API UserDto to local User type
  const mapDtoToUser = useCallback((dto: UserDto): User => ({
    id: dto.id,
    name: dto.name,
    email: dto.email,
    avatar: dto.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    country: dto.country || '',
    campus: dto.campus || '',
    major: dto.major || '',
    year: dto.year || '',
    bio: dto.bio || '',
    interests: dto.interests,
    languages: dto.languages,
    joinedAt: dto.createdAt.split('T')[0],
    isOnline: dto.isOnline,
  }), []);

  // Map EventDto to local Event type
  const mapDtoToEvent = useCallback((dto: EventDto): Event => ({
    id: dto.id,
    title: dto.title,
    description: dto.description || '',
    date: dto.startDate.split('T')[0],
    time: dto.startDate.split('T')[1]?.substring(0, 5) || '',
    location: dto.location || '',
    category: dto.category || 'Social',
    organizer: dto.organizerId,
    attendees: [dto.organizerId], // Will be populated from API
    maxAttendees: dto.maxAttendees || 30,
    image: dto.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
  }), []);

  // Map NotificationDto to local Notification type
  const mapDtoToNotification = useCallback((dto: NotificationDto): Notification => ({
    id: dto.id,
    type: dto.type,
    title: dto.title,
    message: dto.message || '',
    timestamp: dto.createdAt,
    read: dto.isRead,
  }), []);

  // Map AnnouncementDto to local Announcement type
  const mapDtoToAnnouncement = useCallback((dto: AnnouncementDto): Announcement => ({
    id: dto.id,
    title: dto.title,
    content: dto.content,
    author: dto.authorId,
    createdAt: dto.createdAt,
    priority: 'normal',
  }), []);

  // Load initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Fetch all users
        const usersRes = await usersApi.getAll();
        if (usersRes.success && usersRes.data) {
          const users = usersRes.data.map(mapDtoToUser);
          setState(prev => ({ ...prev, users }));
        }

        // Fetch groups
        const groupsRes = await groupsApi.getAll();
        if (groupsRes.success && groupsRes.data) {
          const groups: Group[] = groupsRes.data.map((dto: GroupDto) => ({
            id: dto.id,
            name: dto.name,
            description: dto.description || '',
            members: [],
            createdAt: dto.createdAt,
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            iceBreakers: [],
            checklist: [],
            polls: [],
          }));
          setState(prev => ({ 
            ...prev, 
            groups,
            currentGroupId: groups[0]?.id || null,
          }));
        }

        // Fetch events
        const eventsRes = await eventsApi.getAll();
        if (eventsRes.success && eventsRes.data) {
          const events = eventsRes.data.map(mapDtoToEvent);
          setState(prev => ({ ...prev, events }));
        }

        // Fetch announcements
        const announcementsRes = await announcementsApi.getAll();
        if (announcementsRes.success && announcementsRes.data) {
          const announcements = announcementsRes.data.map(mapDtoToAnnouncement);
          setState(prev => ({ ...prev, announcements }));
        }

        setState(prev => ({ ...prev, loading: false }));
      } catch (error) {
        console.error('[AppContext] Failed to load initial data:', error);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Failed to load data' 
        }));
      }
    };

    loadInitialData();
  }, [mapDtoToUser, mapDtoToEvent, mapDtoToAnnouncement]);

  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<AuthResponse | null>> => {
    console.log('[AppContext] Calling POST /api/auth/login');
    
    const response = await authApi.login({ email, password });
    
    if (response.success && response.data) {
      authApi.saveTokens(response.data.tokens);
      const user = mapDtoToUser(response.data.user);
      
      // Fetch user notifications
      const notificationsRes = await notificationsApi.getAll(user.id);
      const notifications = notificationsRes.success && notificationsRes.data 
        ? notificationsRes.data.map(mapDtoToNotification)
        : [];
      
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: true, 
        currentUser: user,
        users: [...prev.users.filter(u => u.id !== user.id), user],
        notifications,
      }));
    }
    
    return response;
  }, [mapDtoToUser, mapDtoToNotification]);

  const logout = useCallback(async () => {
    if (state.currentUser) {
      console.log('[AppContext] Calling POST /api/auth/logout');
      try { await authApi.logout(); } catch { /* ignore */ }
    }
    tokenManager.clearTokens();
    
    setState(prev => ({ 
      ...prev, 
      isAuthenticated: false, 
      currentUser: null,
      onboardingData: defaultOnboardingData 
    }));
  }, [state.currentUser]);

  const register = useCallback(async (email: string, password: string, name: string): Promise<ApiResponse<AuthResponse | null>> => {
    console.log('[AppContext] Calling POST /api/auth/register');
    
    const response = await authApi.register({ email, password, name });
    
    if (response.success && response.data) {
      authApi.saveTokens(response.data.tokens);
      const user = mapDtoToUser(response.data.user);
      
      // Fetch user notifications
      const notificationsRes = await notificationsApi.getAll(user.id);
      const notifications = notificationsRes.success && notificationsRes.data 
        ? notificationsRes.data.map(mapDtoToNotification)
        : [];
      
      setState(prev => ({
        ...prev,
        users: [...prev.users, user],
        currentUser: user,
        isAuthenticated: true,
        notifications,
      }));
    }
    
    return response;
  }, [mapDtoToUser, mapDtoToNotification]);

  const setOnboardingData = useCallback((data: Partial<OnboardingData>) => {
    setState(prev => ({
      ...prev,
      onboardingData: { ...prev.onboardingData, ...data },
    }));
  }, []);

  const completeOnboarding = useCallback(async (): Promise<ApiResponse<UserDto | null>> => {
    const { onboardingData, currentUser } = state;
    if (!currentUser) {
      return { success: false, data: null, message: 'Not authenticated', errors: ['User must be logged in'], statusCode: 401 };
    }

    console.log('[AppContext] Calling POST /api/users/:id/onboarding');
    const profileData: CompleteProfileRequest = {
      country: onboardingData.profile.country,
      campus: onboardingData.study.campus,
      major: onboardingData.study.major,
      year: onboardingData.study.year,
      bio: onboardingData.profile.bio || undefined,
      interests: onboardingData.interests,
      languages: onboardingData.preferences.languages,
    };

    const response = await usersApi.completeOnboarding(currentUser.id, profileData);

    if (response.success && response.data) {
      const updatedUser = mapDtoToUser(response.data);
      setState(prev => ({
        ...prev,
        currentUser: updatedUser,
        users: prev.users.map(u => u.id === currentUser.id ? updatedUser : u),
        onboardingData: { ...prev.onboardingData, step: -1 },
      }));
    }

    return response;
  }, [state]);

  const toggleAdmin = useCallback(() => {
    setState(prev => ({ ...prev, isAdmin: !prev.isAdmin }));
  }, []);

  const sendMessage = useCallback(async (groupId: string, content: string) => {
    if (!state.currentUser) return;
    
    try {
      const response = await messagesApi.send(groupId, { content });
      if (response.success && response.data) {
        const newMessage: Message = {
          id: response.data.id,
          groupId,
          senderId: state.currentUser.id,
          content: response.data.content,
          timestamp: response.data.createdAt,
          reactions: [],
        };
        setState(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
      }
    } catch (error) {
      console.error('[AppContext] Failed to send message:', error);
    }
  }, [state.currentUser]);

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!state.currentUser) return;
    
    try {
      // Find the message to get groupId
      const message = state.messages.find(m => m.id === messageId);
      if (!message) return;

      const existingReaction = message.reactions.find(r => r.emoji === emoji && r.users.includes(state.currentUser!.id));
      
      if (existingReaction) {
        // Remove reaction
        await messagesApi.removeReaction(message.groupId, messageId, emoji);
      } else {
        // Add reaction
        await messagesApi.addReaction(message.groupId, messageId, emoji);
      }

      // Update local state
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => {
          if (msg.id !== messageId) return msg;
          const reaction = msg.reactions.find(r => r.emoji === emoji);
          if (reaction) {
            if (reaction.users.includes(state.currentUser!.id)) {
              return {
                ...msg,
                reactions: msg.reactions.map(r =>
                  r.emoji === emoji
                    ? { ...r, users: r.users.filter(u => u !== state.currentUser!.id) }
                    : r
                ).filter(r => r.users.length > 0),
              };
            }
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji ? { ...r, users: [...r.users, state.currentUser!.id] } : r
              ),
            };
          }
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, users: [state.currentUser!.id] }],
          };
        }),
      }));
    } catch (error) {
      console.error('[AppContext] Failed to add reaction:', error);
    }
  }, [state.currentUser, state.messages]);

  const toggleChecklistItem = useCallback(async (groupId: string, itemId: string) => {
    try {
      const response = await groupsApi.toggleChecklistItem(groupId, itemId, { completed: true });
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          groups: prev.groups.map(group =>
            group.id === groupId
              ? {
                  ...group,
                  checklist: group.checklist.map(item =>
                    item.id === itemId ? { ...item, completed: !item.completed } : item
                  ),
                }
              : group
          ),
        }));
      }
    } catch (error) {
      console.error('[AppContext] Failed to toggle checklist item:', error);
    }
  }, []);

  const votePoll = useCallback(async (groupId: string, pollId: string, optionId: string) => {
    if (!state.currentUser) return;
    
    try {
      await groupsApi.votePoll(groupId, pollId, { optionId });
      
      setState(prev => ({
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? {
                ...group,
                polls: group.polls.map(poll =>
                  poll.id === pollId && !poll.votedBy.includes(state.currentUser!.id)
                    ? {
                        ...poll,
                        options: poll.options.map(opt =>
                          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
                        ),
                        votedBy: [...poll.votedBy, state.currentUser!.id],
                      }
                    : poll
                ),
              }
              : group
        ),
      }));
    } catch (error) {
      console.error('[AppContext] Failed to vote on poll:', error);
    }
  }, [state.currentUser]);

  const createEvent = useCallback(async (eventData: Omit<Event, 'id' | 'organizer' | 'attendees'>) => {
    if (!state.currentUser) return;
    
    try {
      const response = await eventsApi.create({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        category: eventData.category,
        maxAttendees: eventData.maxAttendees,
        image: eventData.image,
      });

      if (response.success && response.data) {
        const newEvent: Event = {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          date: response.data.date,
          time: response.data.time,
          location: response.data.location,
          category: response.data.category,
          organizer: response.data.organizerId,
          attendees: response.data.attendeeIds || [state.currentUser.id],
          maxAttendees: response.data.maxAttendees,
          image: response.data.image,
        };
        setState(prev => ({ ...prev, events: [...prev.events, newEvent] }));
      }
    } catch (error) {
      console.error('[AppContext] Failed to create event:', error);
    }
  }, [state.currentUser]);

  const rsvpEvent = useCallback(async (eventId: string) => {
    if (!state.currentUser) return;
    
    try {
      const event = state.events.find(e => e.id === eventId);
      if (!event) return;

      const isAttending = event.attendees.includes(state.currentUser.id);
      
      if (isAttending) {
        await eventsApi.leave(eventId);
      } else {
        await eventsApi.join(eventId);
      }

      // Update local state
      setState(prev => ({
        ...prev,
        events: prev.events.map(e =>
          e.id === eventId
            ? {
                ...e,
                attendees: isAttending
                  ? e.attendees.filter(id => id !== state.currentUser!.id)
                  : [...e.attendees, state.currentUser!.id],
              }
            : e
        ),
      }));
    } catch (error) {
      console.error('[AppContext] Failed to RSVP event:', error);
    }
  }, [state.currentUser, state.events]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!state.currentUser) return;
    
    try {
      const response = await usersApi.update(state.currentUser.id, {
        name: data.name,
        bio: data.bio,
        country: data.country,
        campus: data.campus,
        major: data.major,
        year: data.year,
        interests: data.interests,
        languages: data.languages,
      });

      if (response.success && response.data) {
        const updatedUser = mapDtoToUser(response.data);
        setState(prev => ({
          ...prev,
          currentUser: updatedUser,
          users: prev.users.map(u => u.id === state.currentUser!.id ? updatedUser : u),
        }));
      }
    } catch (error) {
      console.error('[AppContext] Failed to update profile:', error);
    }
  }, [state.currentUser, mapDtoToUser]);

  const markNotificationRead = useCallback(async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
    } catch (error) {
      console.error('[AppContext] Failed to mark notification as read:', error);
    }
  }, []);

  const getUserById = useCallback((userId: string) => {
    return state.users.find(u => u.id === userId);
  }, [state.users]);

  const getGroupById = useCallback((groupId: string) => {
    return state.groups.find(g => g.id === groupId);
  }, [state.groups]);

  const getCurrentGroup = useCallback(() => {
    return state.groups.find(g => g.id === state.currentGroupId);
  }, [state.groups, state.currentGroupId]);

  const createPoll = useCallback((groupId: string, question: string, options: string[]) => {
    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      question,
      options: options.map((text, idx) => ({ id: `opt-${idx}`, text, votes: 0 })),
      votedBy: [],
    };
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(group =>
        group.id === groupId ? { ...group, polls: [...group.polls, newPoll] } : group
      ),
    }));
  }, []);

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser: User = { ...userData, id: `user-${Date.now()}` };
    setState(prev => ({ ...prev, users: [...prev.users, newUser] }));
  }, []);

  const updateUser = useCallback((userId: string, data: Partial<User>) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => (u.id === userId ? { ...u, ...data } : u)),
    }));
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId),
    }));
  }, []);

  const addAnnouncement = useCallback((data: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      announcements: [newAnnouncement, ...prev.announcements],
    }));
  }, []);

  const setRotationPreference = useCallback((preference: 'rotate' | 'stay' | 'undecided') => {
    setState(prev => ({ ...prev, rotationPreference: preference }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        setOnboardingData,
        completeOnboarding,
        toggleAdmin,
        sendMessage,
        addReaction,
        toggleChecklistItem,
        votePoll,
        createEvent,
        rsvpEvent,
        updateProfile,
        markNotificationRead,
        getUserById,
        getGroupById,
        getCurrentGroup,
        createPoll,
        addUser,
        updateUser,
        deleteUser,
        addAnnouncement,
        setRotationPreference,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
