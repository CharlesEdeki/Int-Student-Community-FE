/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { authApi } from '@/services/api/auth';
import { usersApi } from '@/services/api/users';
import { groupsApi } from '@/services/api/groups';
import { eventsApi } from '@/services/api/events';
import { messagesApi } from '@/services/api/messages';
import { notificationsApi } from '@/services/api/notifications';
import { announcementsApi } from '@/services/api/announcements';
import { tokenManager } from '@/services/api/client';
import type { UserDto, ApiResponse, CompleteProfileRequest, GroupDto, EventDto, MessageDto, NotificationDto, AnnouncementDto, AuthResponse, PollOptionDto, GroupMemberDto } from '@/services/api/types';

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
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  setRotationPreference: (preference: 'rotate' | 'stay' | 'undecided') => void;
  loadGroupMessages: (groupId: string) => Promise<void>;
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
  const mapDtoToEvent = useCallback((dto: EventDto): Event => {
    const startDate = new Date(dto.startDate);
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description || '',
      date: startDate.toISOString().split('T')[0],
      time: startDate.toISOString().split('T')[1]?.substring(0, 5) || '',
      location: dto.location || '',
      category: 'Social',
      organizer: dto.organizerId,
      attendees: [dto.organizerId],
      maxAttendees: dto.maxAttendees || 30,
      image: dto.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
    };
  }, []);

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
    author: dto.author?.name || dto.authorId,
    createdAt: dto.createdAt,
    priority: dto.isPinned ? 'high' : 'normal',
  }), []);

  // Load initial data on mount (only if authenticated)
  useEffect(() => {
    if (!tokenManager.getAccessToken()) return;

    const loadInitialData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Fetch all data in parallel
        const [usersRes, groupsRes, eventsRes, announcementsRes] = await Promise.all([
          usersApi.getAll(),
          groupsApi.getAll(),
          eventsApi.getAll(),
          announcementsApi.getAll(),
        ]);

        const users = usersRes.success && usersRes.data ? usersRes.data.map(mapDtoToUser) : [];
        
        let groups: Group[] = [];
        if (groupsRes.success && groupsRes.data) {
          // For each group, fetch members
          groups = await Promise.all(groupsRes.data.map(async (dto: GroupDto) => {
            let memberIds: string[] = [];
            try {
              const membersRes = await groupsApi.getMembers(dto.id);
              if (membersRes.success && membersRes.data) {
                memberIds = (membersRes.data as GroupMemberDto[]).map((m: GroupMemberDto) => m.userId);
              }
            } catch { /* ignore */ }

            // Fetch checklist
            let checklist: ChecklistItem[] = [];
            try {
              const checklistRes = await groupsApi.getChecklist(dto.id);
              if (checklistRes.success && checklistRes.data) {
                checklist = checklistRes.data.map(item => ({
                  id: item.id,
                  title: item.title,
                  completed: item.isCompleted,
                }));
              }
            } catch { /* ignore */ }

            // Fetch polls
            let polls: Poll[] = [];
            try {
              const pollsRes = await groupsApi.getPolls(dto.id);
              if (pollsRes.success && pollsRes.data) {
                polls = pollsRes.data.map(p => ({
                  id: p.id,
                  question: p.question,
                  options: p.options.map(o => ({
                    id: o.id,
                    text: o.text,
                    votes: o.voteCount,
                  })),
                  votedBy: [],
                }));
              }
            } catch { /* ignore */ }

            return {
              id: dto.id,
              name: dto.name,
              description: dto.description || '',
              members: memberIds,
              createdAt: dto.createdAt,
              expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              iceBreakers: [],
              checklist,
              polls,
            };
          }));
        }

        const events = eventsRes.success && eventsRes.data ? eventsRes.data.map(mapDtoToEvent) : [];
        const announcements = announcementsRes.success && announcementsRes.data ? announcementsRes.data.map(mapDtoToAnnouncement) : [];

        setState(prev => ({ 
          ...prev, 
          users,
          groups,
          currentGroupId: groups[0]?.id || null,
          events,
          announcements,
          loading: false,
        }));
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
    const response = await authApi.login({ email, password });
    
    if (response.success && response.data) {
      authApi.saveTokens(response.data.tokens);
      const user = mapDtoToUser(response.data.user);
      
      // Fetch user notifications
      let notifications: Notification[] = [];
      try {
        const notificationsRes = await notificationsApi.getAll(user.id);
        notifications = notificationsRes.success && notificationsRes.data 
          ? notificationsRes.data.map(mapDtoToNotification)
          : [];
      } catch { /* ignore */ }

      // Fetch groups, events, announcements after login
      const [groupsRes, eventsRes, announcementsRes, usersRes] = await Promise.all([
        groupsApi.getAll(),
        eventsApi.getAll(),
        announcementsApi.getAll(),
        usersApi.getAll(),
      ]);

      const users = usersRes.success && usersRes.data ? usersRes.data.map(mapDtoToUser) : [];
      const events = eventsRes.success && eventsRes.data ? eventsRes.data.map(mapDtoToEvent) : [];
      const announcements = announcementsRes.success && announcementsRes.data ? announcementsRes.data.map(mapDtoToAnnouncement) : [];

      let groups: Group[] = [];
      if (groupsRes.success && groupsRes.data) {
        groups = groupsRes.data.map((dto: GroupDto) => ({
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
      }
      
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: true, 
        currentUser: user,
        users: [...users.filter(u => u.id !== user.id), user],
        notifications,
        groups,
        currentGroupId: groups[0]?.id || null,
        events,
        announcements,
      }));
    }
    
    return response;
  }, [mapDtoToUser, mapDtoToNotification, mapDtoToEvent, mapDtoToAnnouncement]);

  const logout = useCallback(async () => {
    if (state.currentUser) {
      try { await authApi.logout(); } catch { /* ignore */ }
    }
    tokenManager.clearTokens();
    
    setState(prev => ({ 
      ...prev, 
      isAuthenticated: false, 
      currentUser: null,
      users: [],
      groups: [],
      messages: [],
      events: [],
      notifications: [],
      announcements: [],
      onboardingData: defaultOnboardingData,
      currentGroupId: null,
    }));
  }, [state.currentUser]);

  const register = useCallback(async (email: string, password: string, name: string): Promise<ApiResponse<AuthResponse | null>> => {
    const response = await authApi.register({ email, password, name });
    
    if (response.success && response.data) {
      authApi.saveTokens(response.data.tokens);
      const user = mapDtoToUser(response.data.user);
      
      setState(prev => ({
        ...prev,
        currentUser: user,
        isAuthenticated: true,
      }));
    }
    
    return response;
  }, [mapDtoToUser]);

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
  }, [state, mapDtoToUser]);

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

  const loadGroupMessages = useCallback(async (groupId: string) => {
    try {
      const response = await messagesApi.getGroupMessages(groupId);
      if (response.success && response.data) {
        const messages: Message[] = response.data.map((dto: MessageDto) => ({
          id: dto.id,
          groupId: dto.groupId || groupId,
          senderId: dto.senderId,
          content: dto.content,
          timestamp: dto.createdAt,
          reactions: [],
        }));
        setState(prev => ({
          ...prev,
          messages: [
            ...prev.messages.filter(m => m.groupId !== groupId),
            ...messages,
          ],
        }));
      }
    } catch (error) {
      console.error('[AppContext] Failed to load messages:', error);
    }
  }, []);

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!state.currentUser) return;
    
    try {
      const message = state.messages.find(m => m.id === messageId);
      if (!message) return;

      const existingReaction = message.reactions.find(r => r.emoji === emoji && r.users.includes(state.currentUser!.id));
      
      if (existingReaction) {
        await messagesApi.removeReaction(message.groupId, messageId, emoji);
      } else {
        await messagesApi.addReaction(message.groupId, messageId, emoji);
      }

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
      // Combine date and time into ISO format
      const startDateTime = `${eventData.date}T${eventData.time}:00`;
      
      const response = await eventsApi.create({
        title: eventData.title,
        description: eventData.description,
        startDate: startDateTime,
        location: eventData.location,
        maxAttendees: eventData.maxAttendees,
        imageUrl: eventData.image,
      });

      if (response.success && response.data) {
        const newEvent: Event = {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          date: response.data.startDate.split('T')[0],
          time: response.data.startDate.split('T')[1]?.substring(0, 5) || '',
          location: response.data.location || '',
          category: 'Social',
          organizer: response.data.organizerId,
          attendees: [state.currentUser.id],
          maxAttendees: response.data.maxAttendees || 30,
          image: response.data.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
        };
        setState(prev => ({ ...prev, events: [...prev.events, newEvent] }));
      }
    } catch (error) {
      console.error('[AppContext] Failed to create event:', error);
    }
  }, [state.currentUser, mapDtoToEvent]);

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

  const createPoll = useCallback(async (groupId: string, question: string, options: string[]) => {
    try {
      const response = await groupsApi.createPoll(groupId, { 
        question, 
        options: options.map(text => ({ text }))
      });
      
      if (response.success && response.data) {
        const newPoll: Poll = {
          id: response.data.id,
          question: response.data.question,
          options: response.data.options.map((opt: PollOptionDto) => ({
            id: opt.id,
            text: opt.text,
            votes: opt.voteCount,
          })),
          votedBy: [],
        };
        setState(prev => ({
          ...prev,
          groups: prev.groups.map(group =>
            group.id === groupId ? { ...group, polls: [...group.polls, newPoll] } : group
          ),
        }));
      }
    } catch (error) {
      console.error('[AppContext] Failed to create poll:', error);
    }
  }, []);

  const addAnnouncement = useCallback(async (data: Omit<Announcement, 'id' | 'createdAt'>) => {
    if (!state.currentUser) return;

    try {
      const response = await announcementsApi.create({
        title: data.title,
        content: data.content,
        priority: (data.priority as 'high' | 'normal' | 'low') || 'normal',
      });

      if (response.success && response.data) {
        const newAnnouncement = mapDtoToAnnouncement(response.data);
        setState(prev => ({
          ...prev,
          announcements: [newAnnouncement, ...prev.announcements],
        }));
      }
    } catch (error) {
      console.error('[AppContext] Failed to create announcement:', error);
    }
  }, [state.currentUser, mapDtoToAnnouncement]);

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
        addAnnouncement,
        setRotationPreference,
        loadGroupMessages,
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
