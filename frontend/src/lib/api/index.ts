/**
 * Centralized API service - All API functions in one place
 * This is the single source of truth for all API interactions
 */

import { httpClient, ApiException, setTokens, clearTokens } from './client';
import { ENDPOINTS } from './endpoints';
import type {
  // Auth types
  RegisterData,
  LoginData,
  AuthResponse,
  ChangePasswordData,
  UpdateProfileData,
  User,
  // Story types
  Story,
  CreateStoryData,
  UpdateStoryData,
  StoryFilters,
  // RPG Template types
  RpgTemplate,
  CreateRpgTemplateData,
  UpdateRpgTemplateData,
  // Node types
  Node,
  CreateNodeData,
  UpdateNodeData,
  // Choice types
  Choice,
  CreateChoiceData,
  UpdateChoiceData,
  // Play session types
  PlaySession,
  StartSessionData,
  MakeChoiceData,
  // Variable types
  StoryVariable,
  CreateVariableData,
  // Item types
  StoryItem,
  CreateItemData,
  ApiResponse,
} from './types';

// ====================
// AUTH API FUNCTIONS
// ====================

export const authApi = {
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
    
    if (response.success && response.data) {
      setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response;
  },

  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data);
    
    if (response.success && response.data) {
      setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response;
  },

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await httpClient.post<void>(ENDPOINTS.AUTH.LOGOUT);
      clearTokens();
      return response;
    } catch (error) {
      // Clear tokens even if logout fails
      clearTokens();
      throw error;
    }
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return httpClient.get<User>(ENDPOINTS.AUTH.PROFILE);
  },

  async changePassword(data: ChangePasswordData): Promise<ApiResponse<void>> {
    return httpClient.post<void>(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    return httpClient.patch<User>(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  },
};

// ====================
// STORY API FUNCTIONS
// ====================

export const storyApi = {
  async getStories(filters: StoryFilters = {}): Promise<ApiResponse<{ stories: Story[]; pagination: any }>> {
    const searchParams = new URLSearchParams();
    
    if (filters.page) searchParams.set('page', filters.page.toString());
    if (filters.limit) searchParams.set('limit', filters.limit.toString());
    if (filters.search) searchParams.set('search', filters.search);
    if (filters.authorId) searchParams.set('authorId', filters.authorId);
    if (filters.visibility) searchParams.set('visibility', filters.visibility);
    if (filters.tags) searchParams.set('tags', filters.tags.join(','));

    const endpoint = searchParams.toString() 
      ? `${ENDPOINTS.STORIES.BASE}?${searchParams.toString()}`
      : ENDPOINTS.STORIES.BASE;

    return httpClient.get<{ stories: Story[]; pagination: any }>(endpoint);
  },

  async getStory(id: string): Promise<ApiResponse<Story>> {
    return httpClient.get<Story>(ENDPOINTS.STORIES.BY_ID(id));
  },

  async createStory(data: CreateStoryData): Promise<ApiResponse<Story>> {
    return httpClient.post<Story>(ENDPOINTS.STORIES.BASE, data);
  },

  async updateStory(id: string, data: UpdateStoryData): Promise<ApiResponse<Story>> {
    return httpClient.patch<Story>(ENDPOINTS.STORIES.BY_ID(id), data);
  },

  async deleteStory(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(ENDPOINTS.STORIES.BY_ID(id));
  },

  async publishStory(id: string, published: boolean): Promise<ApiResponse<Story>> {
    const endpoint = published 
      ? ENDPOINTS.STORIES.PUBLISH(id) 
      : ENDPOINTS.STORIES.UNPUBLISH(id);
    return httpClient.post<Story>(endpoint);
  },
};

// ====================
// RPG TEMPLATE API FUNCTIONS
// ====================

export const rpgTemplateApi = {
  async getTemplates(filters: { page?: number; limit?: number; search?: string; creatorId?: string; isPublic?: boolean } = {}): Promise<ApiResponse<{ templates: RpgTemplate[]; pagination: any }>> {
    const searchParams = new URLSearchParams();
    
    if (filters.page) searchParams.set('page', filters.page.toString());
    if (filters.limit) searchParams.set('limit', filters.limit.toString());
    if (filters.search) searchParams.set('search', filters.search);
    if (filters.creatorId) searchParams.set('creatorId', filters.creatorId);
    if (filters.isPublic !== undefined) searchParams.set('isPublic', filters.isPublic.toString());

    const endpoint = searchParams.toString() 
      ? `${ENDPOINTS.RPG_TEMPLATES.BASE}?${searchParams.toString()}`
      : ENDPOINTS.RPG_TEMPLATES.BASE;

    return httpClient.get<{ templates: RpgTemplate[]; pagination: any }>(endpoint);
  },

  async getTemplate(id: string): Promise<ApiResponse<RpgTemplate>> {
    return httpClient.get<RpgTemplate>(ENDPOINTS.RPG_TEMPLATES.BY_ID(id));
  },

  async createTemplate(data: CreateRpgTemplateData): Promise<ApiResponse<RpgTemplate>> {
    return httpClient.post<RpgTemplate>(ENDPOINTS.RPG_TEMPLATES.BASE, data);
  },

  async updateTemplate(id: string, data: UpdateRpgTemplateData): Promise<ApiResponse<RpgTemplate>> {
    return httpClient.patch<RpgTemplate>(ENDPOINTS.RPG_TEMPLATES.BY_ID(id), data);
  },

  async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(ENDPOINTS.RPG_TEMPLATES.BY_ID(id));
  },
};

// ====================
// NODE API FUNCTIONS
// ====================

export const nodeApi = {
  async getStoryNodes(storyId: string): Promise<ApiResponse<Node[]>> {
    return httpClient.get<Node[]>(ENDPOINTS.STORIES.NODES(storyId));
  },

  async getNode(id: string): Promise<ApiResponse<Node>> {
    return httpClient.get<Node>(ENDPOINTS.NODES.BY_ID(id));
  },

  async createNode(data: CreateNodeData): Promise<ApiResponse<Node>> {
    return httpClient.post<Node>(ENDPOINTS.NODES.BASE, data);
  },

  async updateNode(id: string, data: UpdateNodeData): Promise<ApiResponse<Node>> {
    return httpClient.patch<Node>(ENDPOINTS.NODES.BY_ID(id), data);
  },

  async deleteNode(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(ENDPOINTS.NODES.BY_ID(id));
  },
};

// ====================
// CHOICE API FUNCTIONS
// ====================

export const choiceApi = {
  async getNodeChoices(nodeId: string): Promise<ApiResponse<Choice[]>> {
    return httpClient.get<Choice[]>(ENDPOINTS.NODES.CHOICES(nodeId));
  },

  async getChoice(id: string): Promise<ApiResponse<Choice>> {
    return httpClient.get<Choice>(ENDPOINTS.CHOICES.BY_ID(id));
  },

  async createChoice(data: CreateChoiceData): Promise<ApiResponse<Choice>> {
    return httpClient.post<Choice>(ENDPOINTS.CHOICES.BASE, data);
  },

  async updateChoice(id: string, data: UpdateChoiceData): Promise<ApiResponse<Choice>> {
    return httpClient.patch<Choice>(ENDPOINTS.CHOICES.BY_ID(id), data);
  },

  async deleteChoice(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(ENDPOINTS.CHOICES.BY_ID(id));
  },
};

// ====================
// PLAYER API FUNCTIONS
// ====================

export const playerApi = {
  async startSession(data: StartSessionData): Promise<ApiResponse<PlaySession>> {
    return httpClient.post<PlaySession>(ENDPOINTS.PLAYER.START, data);
  },

  async getSession(sessionId: string): Promise<ApiResponse<PlaySession>> {
    return httpClient.get<PlaySession>(ENDPOINTS.PLAYER.SESSION_BY_ID(sessionId));
  },

  async makeChoice(sessionId: string, data: MakeChoiceData): Promise<ApiResponse<PlaySession>> {
    return httpClient.post<PlaySession>(ENDPOINTS.PLAYER.MAKE_CHOICE(sessionId), data);
  },

  async getSessions(): Promise<ApiResponse<PlaySession[]>> {
    return httpClient.get<PlaySession[]>(ENDPOINTS.PLAYER.SESSIONS);
  },
};

// ====================
// VARIABLE API FUNCTIONS
// ====================

export const variableApi = {
  async getStoryVariables(storyId: string): Promise<ApiResponse<StoryVariable[]>> {
    return httpClient.get<StoryVariable[]>(ENDPOINTS.STORIES.VARIABLES(storyId));
  },

  async createVariable(storyId: string, data: CreateVariableData): Promise<ApiResponse<StoryVariable>> {
    return httpClient.post<StoryVariable>(ENDPOINTS.STORIES.VARIABLES(storyId), data);
  },
};

// ====================
// ITEM API FUNCTIONS
// ====================

export const itemApi = {
  async getStoryItems(storyId: string): Promise<ApiResponse<StoryItem[]>> {
    return httpClient.get<StoryItem[]>(ENDPOINTS.STORIES.ITEMS(storyId));
  },

  async createItem(storyId: string, data: CreateItemData): Promise<ApiResponse<StoryItem>> {
    return httpClient.post<StoryItem>(ENDPOINTS.STORIES.ITEMS(storyId), data);
  },
};

// ====================
// DISCOVERY API FUNCTIONS
// ====================

export const discoveryApi = {
  async getFeatured(): Promise<ApiResponse<Story[]>> {
    return httpClient.get<Story[]>(ENDPOINTS.DISCOVERY.FEATURED);
  },

  async getPopular(): Promise<ApiResponse<Story[]>> {
    return httpClient.get<Story[]>(ENDPOINTS.DISCOVERY.POPULAR);
  },

  async getRecent(): Promise<ApiResponse<Story[]>> {
    return httpClient.get<Story[]>(ENDPOINTS.DISCOVERY.RECENT);
  },

  async search(query: string): Promise<ApiResponse<Story[]>> {
    return httpClient.get<Story[]>(`${ENDPOINTS.DISCOVERY.SEARCH}?q=${encodeURIComponent(query)}`);
  },
};

// ====================
// SOCIAL API FUNCTIONS
// ====================

export const socialApi = {
  async followUser(userId: string): Promise<ApiResponse<void>> {
    return httpClient.post<void>(ENDPOINTS.SOCIAL.FOLLOW(userId));
  },

  async unfollowUser(userId: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(ENDPOINTS.SOCIAL.UNFOLLOW(userId));
  },

  async getFollowers(userId: string): Promise<ApiResponse<User[]>> {
    return httpClient.get<User[]>(ENDPOINTS.SOCIAL.FOLLOWERS(userId));
  },

  async getFollowing(userId: string): Promise<ApiResponse<User[]>> {
    return httpClient.get<User[]>(ENDPOINTS.SOCIAL.FOLLOWING(userId));
  },
};

// Export all API modules and utilities
export * from './client';
export * from './endpoints';
export * from './types';

// Export default object with all APIs
export default {
  auth: authApi,
  story: storyApi,
  rpgTemplate: rpgTemplateApi,
  node: nodeApi,
  choice: choiceApi,
  player: playerApi,
  variable: variableApi,
  item: itemApi,
  discovery: discoveryApi,
  social: socialApi,
};