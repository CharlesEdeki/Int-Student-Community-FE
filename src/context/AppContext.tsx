import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import demoData from '@/demo-data/data.json';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  country: string;
  university: string;
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
    university: string;
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
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  toggleAdmin: () => void;
  sendMessage: (groupId: string, content: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  toggleChecklistItem: (groupId: string, itemId: string) => void;
  votePoll: (groupId: string, pollId: string, optionId: string) => void;
  createEvent: (event: Omit<Event, 'id' | 'organizer' | 'attendees'>) => void;
  rsvpEvent: (eventId: string) => void;
  updateProfile: (data: Partial<User>) => void;
  markNotificationRead: (notificationId: string) => void;
  getUserById: (userId: string) => User | undefined;
  getGroupById: (groupId: string) => Group | undefined;
  getCurrentGroup: () => Group | undefined;
  createPoll: (groupId: string, question: string, options: string[]) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  setRotationPreference: (preference: 'rotate' | 'stay' | 'undecided') => void;
}

const defaultOnboardingData: OnboardingData = {
  step: 0,
  profile: { name: '', email: '', avatar: '', country: '', bio: '' },
  study: { university: '', major: '', year: '' },
  interests: [],
  preferences: { groupSize: '', matchingPreference: '', languages: [], rotationPreference: 'undecided' },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    isAdmin: false,
    currentUser: null,
    users: demoData.users as User[],
    groups: demoData.groups as Group[],
    messages: demoData.messages as Message[],
    events: demoData.events as Event[],
    notifications: demoData.notifications as Notification[],
    announcements: demoData.announcements as Announcement[],
    onboardingData: defaultOnboardingData,
    currentGroupId: 'group-1',
    rotationPreference: 'undecided',
  });

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    const user = state.users.find(u => u.email === email);
    if (user) {
      setState(prev => ({ ...prev, isAuthenticated: true, currentUser: user }));
      return true;
    }
    // Demo: allow any email to login, create a mock user
    const mockUser: User = {
      id: 'current-user',
      name: email.split('@')[0],
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      country: 'United States',
      university: 'Demo University',
      major: 'Undeclared',
      year: 'Freshman',
      bio: 'New member of the community!',
      interests: [],
      languages: ['English'],
      joinedAt: new Date().toISOString().split('T')[0],
      isOnline: true,
    };
    setState(prev => ({ 
      ...prev, 
      isAuthenticated: true, 
      currentUser: mockUser,
      users: [...prev.users, mockUser]
    }));
    return true;
  }, [state.users]);

  const logout = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isAuthenticated: false, 
      currentUser: null,
      onboardingData: defaultOnboardingData 
    }));
  }, []);

  const register = useCallback(async (email: string, _password: string, name: string): Promise<boolean> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      country: '',
      university: '',
      major: '',
      year: '',
      bio: '',
      interests: [],
      languages: [],
      joinedAt: new Date().toISOString().split('T')[0],
      isOnline: true,
    };
    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser,
      isAuthenticated: true,
    }));
    return true;
  }, []);

  const setOnboardingData = useCallback((data: Partial<OnboardingData>) => {
    setState(prev => ({
      ...prev,
      onboardingData: { ...prev.onboardingData, ...data },
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    const { onboardingData, currentUser } = state;
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        name: onboardingData.profile.name || currentUser.name,
        country: onboardingData.profile.country,
        bio: onboardingData.profile.bio,
        university: onboardingData.study.university,
        major: onboardingData.study.major,
        year: onboardingData.study.year,
        interests: onboardingData.interests,
        languages: onboardingData.preferences.languages,
      };
      setState(prev => ({
        ...prev,
        currentUser: updatedUser,
        users: prev.users.map(u => u.id === currentUser.id ? updatedUser : u),
        onboardingData: { ...prev.onboardingData, step: -1 },
      }));
    }
  }, [state]);

  const toggleAdmin = useCallback(() => {
    setState(prev => ({ ...prev, isAdmin: !prev.isAdmin }));
  }, []);

  const sendMessage = useCallback((groupId: string, content: string) => {
    if (!state.currentUser) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      groupId,
      senderId: state.currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      reactions: [],
    };
    setState(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
  }, [state.currentUser]);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!state.currentUser) return;
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => {
        if (msg.id !== messageId) return msg;
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes(state.currentUser!.id)) {
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
  }, [state.currentUser]);

  const toggleChecklistItem = useCallback((groupId: string, itemId: string) => {
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
  }, []);

  const votePoll = useCallback((groupId: string, pollId: string, optionId: string) => {
    if (!state.currentUser) return;
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
  }, [state.currentUser]);

  const createEvent = useCallback((eventData: Omit<Event, 'id' | 'organizer' | 'attendees'>) => {
    if (!state.currentUser) return;
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}`,
      organizer: state.currentUser.id,
      attendees: [state.currentUser.id],
    };
    setState(prev => ({ ...prev, events: [...prev.events, newEvent] }));
  }, [state.currentUser]);

  const rsvpEvent = useCallback((eventId: string) => {
    if (!state.currentUser) return;
    setState(prev => ({
      ...prev,
      events: prev.events.map(event =>
        event.id === eventId
          ? {
              ...event,
              attendees: event.attendees.includes(state.currentUser!.id)
                ? event.attendees.filter(id => id !== state.currentUser!.id)
                : [...event.attendees, state.currentUser!.id],
            }
          : event
      ),
    }));
  }, [state.currentUser]);

  const updateProfile = useCallback((data: Partial<User>) => {
    if (!state.currentUser) return;
    setState(prev => ({
      ...prev,
      currentUser: prev.currentUser ? { ...prev.currentUser, ...data } : null,
      users: prev.users.map(u =>
        u.id === prev.currentUser?.id ? { ...u, ...data } : u
      ),
    }));
  }, [state.currentUser]);

  const markNotificationRead = useCallback((notificationId: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
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
