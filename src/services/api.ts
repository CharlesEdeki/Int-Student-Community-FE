/**
 * Simulated .NET Backend API Service
 * 
 * This service simulates a .NET Web API backend with PostgreSQL database.
 * Replace the BASE_URL and remove simulation logic when connecting to your real backend.
 * 
 * Postman Collection Endpoints:
 * 
 * Authentication:
 * - POST {{BASE_URL}}/api/auth/register
 * - POST {{BASE_URL}}/api/auth/login
 * - POST {{BASE_URL}}/api/auth/refresh
 * - POST {{BASE_URL}}/api/auth/logout
 * 
 * Users:
 * - GET {{BASE_URL}}/api/users
 * - GET {{BASE_URL}}/api/users/:id
 * - PUT {{BASE_URL}}/api/users/:id
 * - DELETE {{BASE_URL}}/api/users/:id
 */

// Configuration - Replace with your actual .NET backend URL
export const API_CONFIG = {
  BASE_URL: 'https://your-dotnet-api.azurewebsites.net', // Your .NET API URL
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Simulated delay to mimic network latency
const simulateNetworkDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (simulates PostgreSQL)
let users: DbUser[] = [];
let refreshTokens: Map<string, string> = new Map();

// Database models (matching PostgreSQL schema)
export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  avatar_url: string | null;
  country: string | null;
  campus: string | null;
  major: string | null;
  year: string | null;
  bio: string | null;
  interests: string[];
  languages: string[];
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

// API Response types (matching .NET API responses)
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors: string[];
  statusCode: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  user: UserDto;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  user: UserDto;
  tokens: AuthTokens;
}

// Helper: Generate JWT-like token
const generateToken = (userId: string, type: 'access' | 'refresh'): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    type,
    iat: Date.now(),
    exp: Date.now() + (type === 'access' ? 3600000 : 604800000), // 1hr / 7days
  }));
  const signature = btoa(`simulated_signature_${userId}_${type}`);
  return `${header}.${payload}.${signature}`;
};

// Helper: Hash password (simulated - in real .NET use BCrypt)
const hashPassword = (password: string): string => {
  return btoa(`hashed_${password}_with_salt`);
};

// Helper: Verify password
const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Helper: Map DB user to DTO
const mapUserToDto = (user: DbUser): UserDto => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatarUrl: user.avatar_url,
  country: user.country,
  campus: user.campus,
  major: user.major,
  year: user.year,
  bio: user.bio,
  interests: user.interests,
  languages: user.languages,
  isOnline: user.is_online,
  createdAt: user.created_at,
});

/**
 * Authentication API
 */
export const authApi = {
  /**
   * POST /api/auth/register
   * 
   * Postman Request:
   * POST {{BASE_URL}}/api/auth/register
   * Body (JSON):
   * {
   *   "email": "user@example.com",
   *   "password": "SecurePassword123!",
   *   "name": "John Doe"
   * }
   */
  register: async (request: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    await simulateNetworkDelay();
    
    console.log('[API] POST /api/auth/register', { email: request.email, name: request.name });
    
    // Validation
    if (!request.email || !request.password || !request.name) {
      return {
        success: false,
        data: null,
        message: 'Validation failed',
        errors: ['Email, password, and name are required'],
        statusCode: 400,
      };
    }

    if (request.password.length < 6) {
      return {
        success: false,
        data: null,
        message: 'Validation failed',
        errors: ['Password must be at least 6 characters'],
        statusCode: 400,
      };
    }

    // Check if email exists
    const existingUser = users.find(u => u.email.toLowerCase() === request.email.toLowerCase());
    if (existingUser) {
      return {
        success: false,
        data: null,
        message: 'Registration failed',
        errors: ['An account with this email already exists'],
        statusCode: 409, // Conflict
      };
    }

    // Create user in "PostgreSQL"
    const newUser: DbUser = {
      id: crypto.randomUUID(),
      email: request.email.toLowerCase(),
      password_hash: hashPassword(request.password),
      name: request.name,
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      country: null,
      campus: null,
      major: null,
      year: null,
      bio: null,
      interests: [],
      languages: [],
      is_online: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push(newUser);

    // Generate tokens
    const accessToken = generateToken(newUser.id, 'access');
    const refreshToken = generateToken(newUser.id, 'refresh');
    refreshTokens.set(refreshToken, newUser.id);

    console.log('[API] User registered successfully:', newUser.id);

    return {
      success: true,
      data: {
        user: mapUserToDto(newUser),
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 3600,
          tokenType: 'Bearer',
        },
      },
      message: 'Registration successful',
      errors: [],
      statusCode: 201,
    };
  },

  /**
   * POST /api/auth/login
   * 
   * Postman Request:
   * POST {{BASE_URL}}/api/auth/login
   * Body (JSON):
   * {
   *   "email": "user@example.com",
   *   "password": "SecurePassword123!"
   * }
   */
  login: async (request: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    await simulateNetworkDelay();
    
    console.log('[API] POST /api/auth/login', { email: request.email });

    // Validation
    if (!request.email || !request.password) {
      return {
        success: false,
        data: null,
        message: 'Validation failed',
        errors: ['Email and password are required'],
        statusCode: 400,
      };
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === request.email.toLowerCase());
    if (!user) {
      return {
        success: false,
        data: null,
        message: 'Authentication failed',
        errors: ['Invalid email or password'],
        statusCode: 401,
      };
    }

    // Verify password
    if (!verifyPassword(request.password, user.password_hash)) {
      return {
        success: false,
        data: null,
        message: 'Authentication failed',
        errors: ['Invalid email or password'],
        statusCode: 401,
      };
    }

    // Update online status
    user.is_online = true;
    user.updated_at = new Date().toISOString();

    // Generate tokens
    const accessToken = generateToken(user.id, 'access');
    const refreshToken = generateToken(user.id, 'refresh');
    refreshTokens.set(refreshToken, user.id);

    console.log('[API] Login successful:', user.id);

    return {
      success: true,
      data: {
        user: mapUserToDto(user),
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 3600,
          tokenType: 'Bearer',
        },
      },
      message: 'Login successful',
      errors: [],
      statusCode: 200,
    };
  },

  /**
   * POST /api/auth/refresh
   * 
   * Postman Request:
   * POST {{BASE_URL}}/api/auth/refresh
   * Body (JSON):
   * {
   *   "refreshToken": "your_refresh_token_here"
   * }
   */
  refresh: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    await simulateNetworkDelay(200);
    
    console.log('[API] POST /api/auth/refresh');

    const userId = refreshTokens.get(refreshToken);
    if (!userId) {
      return {
        success: false,
        data: null,
        message: 'Token refresh failed',
        errors: ['Invalid or expired refresh token'],
        statusCode: 401,
      };
    }

    // Remove old refresh token
    refreshTokens.delete(refreshToken);

    // Generate new tokens
    const newAccessToken = generateToken(userId, 'access');
    const newRefreshToken = generateToken(userId, 'refresh');
    refreshTokens.set(newRefreshToken, userId);

    return {
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
        tokenType: 'Bearer',
      },
      message: 'Token refreshed successfully',
      errors: [],
      statusCode: 200,
    };
  },

  /**
   * POST /api/auth/logout
   * 
   * Postman Request:
   * POST {{BASE_URL}}/api/auth/logout
   * Headers:
   * Authorization: Bearer {accessToken}
   */
  logout: async (userId: string): Promise<ApiResponse<null>> => {
    await simulateNetworkDelay(200);
    
    console.log('[API] POST /api/auth/logout', { userId });

    const user = users.find(u => u.id === userId);
    if (user) {
      user.is_online = false;
      user.updated_at = new Date().toISOString();
    }

    // Remove refresh tokens for this user
    for (const [token, uid] of refreshTokens.entries()) {
      if (uid === userId) {
        refreshTokens.delete(token);
      }
    }

    return {
      success: true,
      data: null,
      message: 'Logout successful',
      errors: [],
      statusCode: 200,
    };
  },
};

/**
 * Users API
 */
export const usersApi = {
  /**
   * GET /api/users
   * 
   * Postman Request:
   * GET {{BASE_URL}}/api/users
   * Headers:
   * Authorization: Bearer {accessToken}
   */
  getAll: async (): Promise<ApiResponse<UserDto[]>> => {
    await simulateNetworkDelay(300);
    
    console.log('[API] GET /api/users');

    return {
      success: true,
      data: users.map(mapUserToDto),
      message: 'Users retrieved successfully',
      errors: [],
      statusCode: 200,
    };
  },

  /**
   * GET /api/users/:id
   * 
   * Postman Request:
   * GET {{BASE_URL}}/api/users/{{userId}}
   * Headers:
   * Authorization: Bearer {accessToken}
   */
  getById: async (id: string): Promise<ApiResponse<UserDto>> => {
    await simulateNetworkDelay(200);
    
    console.log('[API] GET /api/users/:id', { id });

    const user = users.find(u => u.id === id);
    if (!user) {
      return {
        success: false,
        data: null,
        message: 'User not found',
        errors: ['No user exists with the specified ID'],
        statusCode: 404,
      };
    }

    return {
      success: true,
      data: mapUserToDto(user),
      message: 'User retrieved successfully',
      errors: [],
      statusCode: 200,
    };
  },

  /**
   * PUT /api/users/:id
   * 
   * Postman Request:
   * PUT {{BASE_URL}}/api/users/{{userId}}
   * Headers:
   * Authorization: Bearer {accessToken}
   * Body (JSON):
   * {
   *   "name": "Updated Name",
   *   "bio": "Updated bio",
   *   "country": "USA"
   * }
   */
  update: async (id: string, data: Partial<UserDto>): Promise<ApiResponse<UserDto>> => {
    await simulateNetworkDelay();
    
    console.log('[API] PUT /api/users/:id', { id, data });

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'User not found',
        errors: ['No user exists with the specified ID'],
        statusCode: 404,
      };
    }

    // Update user fields
    const user = users[userIndex];
    if (data.name !== undefined) user.name = data.name;
    if (data.bio !== undefined) user.bio = data.bio;
    if (data.country !== undefined) user.country = data.country;
    if (data.campus !== undefined) user.campus = data.campus;
    if (data.major !== undefined) user.major = data.major;
    if (data.year !== undefined) user.year = data.year;
    if (data.interests !== undefined) user.interests = data.interests;
    if (data.languages !== undefined) user.languages = data.languages;
    if (data.avatarUrl !== undefined) user.avatar_url = data.avatarUrl;
    user.updated_at = new Date().toISOString();

    return {
      success: true,
      data: mapUserToDto(user),
      message: 'User updated successfully',
      errors: [],
      statusCode: 200,
    };
  },

  /**
   * DELETE /api/users/:id
   * 
   * Postman Request:
   * DELETE {{BASE_URL}}/api/users/{{userId}}
   * Headers:
   * Authorization: Bearer {accessToken}
   */
  delete: async (id: string): Promise<ApiResponse<null>> => {
    await simulateNetworkDelay();
    
    console.log('[API] DELETE /api/users/:id', { id });

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'User not found',
        errors: ['No user exists with the specified ID'],
        statusCode: 404,
      };
    }

    users.splice(userIndex, 1);

    return {
      success: true,
      data: null,
      message: 'User deleted successfully',
      errors: [],
      statusCode: 200,
    };
  },
};

// Export for testing/debugging
export const getStoredUsers = () => users;
export const clearStorage = () => {
  users = [];
  refreshTokens.clear();
};
