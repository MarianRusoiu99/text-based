import { useAuthStore } from '../stores/authStore';
import { mockApi, isMockMode } from './mockApi';

const API_BASE_URL = 'http://localhost:3000';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      username: string;
      email: string;
      displayName?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

interface ProfileResponse {
  success: boolean;
  data: {
    id: string;
    username: string;
    email: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Store auth data
        const authStore = useAuthStore.getState();
        authStore.login(result.data.user, result.data.accessToken, result.data.refreshToken || 'mock-refresh-token');
      }
      
      return result;
    } catch (error) {
      // Fallback to mock API if backend is not available
      console.log('Backend not available, using mock API for registration');
      try {
        const result = await mockApi.register(data);
        const authStore = useAuthStore.getState();
        authStore.login(result.data.user, result.data.token, 'mock-refresh-token');
        return { success: true, message: 'Registration successful', data: result.data };
      } catch (mockError) {
        console.error('Mock API registration failed:', mockError);
        return { success: false, message: 'Registration failed' };
      }
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        useAuthStore.getState().login(
          result.data.user,
          result.data.accessToken,
          result.data.refreshToken
        );
      }

      return result;
    } catch (error) {
      // Fallback to mock API if backend is not available
      console.log('Backend not available, using mock API for login');
      try {
        const result = await mockApi.login(data);
        const authStore = useAuthStore.getState();
        authStore.login(result.data.user, result.data.token, 'mock-refresh-token');
        return { success: true, message: 'Login successful', data: result.data };
      } catch (mockError) {
        console.error('Mock API login failed:', mockError);
        return { success: false, message: 'Login failed' };
      }
    }
  }

  logout() {
    useAuthStore.getState().logout();
  }

  async getProfile(): Promise<ProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  async updateProfile(data: UpdateProfileData): Promise<UpdateProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async changePassword(data: ChangePasswordData): Promise<ChangePasswordResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  private getAuthHeaders(): { Authorization?: string } {
    const token = useAuthStore.getState().accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
