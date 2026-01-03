import { useState, useCallback, useEffect } from 'react';
import { authApi, usersApi, UserDto, AuthTokens, ApiResponse } from '@/services/api';

interface AuthState {
  user: UserDto | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const TOKEN_STORAGE_KEY = 'auth_tokens';
const USER_STORAGE_KEY = 'auth_user';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load stored auth on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    
    if (storedTokens && storedUser) {
      try {
        const tokens = JSON.parse(storedTokens) as AuthTokens;
        const user = JSON.parse(storedUser) as UserDto;
        setState({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<any>> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const response = await authApi.login({ email, password });
    
    if (response.success && response.data) {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(response.data.tokens));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
      
      setState({
        user: response.data.user,
        tokens: response.data.tokens,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
    
    return response;
  }, []);

  const register = useCallback(async (email: string, password: string, name: string): Promise<ApiResponse<any>> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const response = await authApi.register({ email, password, name });
    
    if (response.success && response.data) {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(response.data.tokens));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
      
      setState({
        user: response.data.user,
        tokens: response.data.tokens,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
    
    return response;
  }, []);

  const logout = useCallback(async () => {
    if (state.user) {
      await authApi.logout(state.user.id);
    }
    
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    
    setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, [state.user]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!state.tokens?.refreshToken) return false;
    
    const response = await authApi.refresh(state.tokens.refreshToken);
    
    if (response.success && response.data) {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(response.data));
      setState(prev => ({ ...prev, tokens: response.data }));
      return true;
    }
    
    return false;
  }, [state.tokens]);

  const updateProfile = useCallback(async (data: Partial<UserDto>): Promise<ApiResponse<UserDto>> => {
    if (!state.user) {
      return {
        success: false,
        data: null,
        message: 'Not authenticated',
        errors: ['User must be logged in to update profile'],
        statusCode: 401,
      };
    }
    
    const response = await usersApi.update(state.user.id, data);
    
    if (response.success && response.data) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data));
      setState(prev => ({ ...prev, user: response.data }));
    }
    
    return response;
  }, [state.user]);

  return {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
  };
};
