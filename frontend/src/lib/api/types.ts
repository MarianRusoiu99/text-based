/**
 * TypeScript type definitions for API requests and responses
 * Based on the comprehensive backend API documentation
 */

// Base API Response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  meta?: {
    timestamp: string;
    version: string;
    pagination?: PaginationMeta;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  errors?: any[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Authentication Types
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PublicUser {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  storiesCount: number;
  followersCount: number;
  followingCount: number;
}

// User Profile Types
export interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

// Story Types
export interface CreateStoryData {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  visibility?: 'public' | 'unlisted' | 'private';
  coverImageUrl?: string;
  rpgTemplateId?: string;
}

export interface Story {
  id: string;
  title: string;
  description?: string;
  authorId: string;
  category?: string;
  tags: string[];
  visibility: string;
  isPublished: boolean;
  isFeatured: boolean;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    displayName?: string;
  };
  rpgTemplate?: RpgTemplate;
  ratingsAverage?: number;
  ratingsCount?: number;
}

export interface StoriesResponse {
  stories: Story[];
  pagination: PaginationMeta;
}

export interface UpdateStoryData {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  visibility?: 'public' | 'unlisted' | 'private';
  coverImageUrl?: string;
  rpgTemplateId?: string;
}

export interface StoryFilters {
  search?: string;
  authorId?: string;
  category?: string;
  tags?: string;
  visibility?: string;
  page?: number;
  limit?: number;
}

// Chapter Types
export interface CreateChapterData {
  title: string;
  description?: string;
  order?: number;
}

export interface Chapter {
  id: string;
  storyId: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Story Variables Types
export interface CreateVariableData {
  variableName: string;
  variableType: 'boolean' | 'number' | 'string';
  defaultValue?: any;
  description?: string;
}

export interface StoryVariable {
  id: string;
  storyId: string;
  variableName: string;
  variableType: string;
  defaultValue?: any;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Item Types
export interface CreateItemData {
  name: string;
  description?: string;
  type?: string;
  properties?: Record<string, any>;
}

export interface StoryItem {
  id: string;
  storyId: string;
  name: string;
  description?: string;
  type?: string;
  properties?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Node Types
export interface CreateNodeData {
  title: string;
  content: string;
  nodeType?: 'story' | 'choice' | 'rpgCheck';
  chapterId?: string;
  characterName?: string;
  backgroundUrl?: string;
  position?: {
    x: number;
    y: number;
  };
  rpgCheck?: {
    stat: string;
    skill?: string;
    difficulty: number;
    successMessage: string;
    failureMessage: string;
  };
}

export interface Node {
  id: string;
  storyId: string;
  chapterId?: string;
  title: string;
  content: string;
  nodeType: string;
  characterName?: string;
  backgroundUrl?: string;
  position?: {
    x: number;
    y: number;
  };
  rpgCheck?: any;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNodeData {
  title?: string;
  content?: string;
  nodeType?: 'story' | 'choice' | 'rpgCheck';
  characterName?: string;
  backgroundUrl?: string;
  position?: {
    x: number;
    y: number;
  };
  rpgCheck?: any;
}

// Choice Types
export interface CreateChoiceData {
  text: string;
  toNodeId: string;
  conditions?: Record<string, any>;
  effects?: Record<string, any>;
  order?: number;
}

export interface Choice {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  text: string;
  conditions?: Record<string, any>;
  effects?: Record<string, any>;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateChoiceData {
  text?: string;
  toNodeId?: string;
  conditions?: Record<string, any>;
  effects?: Record<string, any>;
  order?: number;
}

// RPG Template Types
export interface CreateRpgTemplateData {
  name: string;
  description?: string;
  isPublic?: boolean;
  config: {
    stats: string[];
    skills: string[];
    attributes: string[];
    diceSystem: string;
  };
}

export interface RpgTemplate {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  config: {
    stats: string[];
    skills: string[];
    attributes: string[];
    diceSystem: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRpgTemplateData {
  name?: string;
  description?: string;
  isPublic?: boolean;
  config?: {
    stats?: string[];
    skills?: string[];
    attributes?: string[];
    diceSystem?: string;
  };
}

// Player/Gameplay Types
export interface StartSessionData {
  storyId: string;
  characterName?: string;
  initialStats?: Record<string, any>;
}

export interface PlaySession {
  id: string;
  userId: string;
  storyId: string;
  currentNodeId: string;
  characterName?: string;
  gameState: {
    stats?: Record<string, any>;
    inventory?: string[];
    variables?: Record<string, any>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MakeChoiceData {
  choiceId: string;
  additionalData?: Record<string, any>;
}

export interface UpdateGameStateData {
  stats?: Record<string, any>;
  inventory?: string[];
  variables?: Record<string, any>;
}

export interface SaveGameData {
  saveName: string;
}

export interface LoadGameData {
  savedGameId: string;
}

export interface SavedGame {
  id: string;
  userId: string;
  sessionId: string;
  saveName: string;
  gameState: any;
  createdAt: string;
}

// Social Features Types
export interface RateStoryData {
  rating: number; // 1-5
  review?: string;
}

export interface Rating {
  id: string;
  userId: string;
  storyId: string;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
  };
}

export interface AddCommentData {
  content: string;
  parentCommentId?: string;
}

export interface Comment {
  id: string;
  userId: string;
  storyId: string;
  parentCommentId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
  };
  replies?: Comment[];
}

export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower: PublicUser;
  following: PublicUser;
}

export interface StoryBookmark {
  id: string;
  userId: string;
  storyId: string;
  createdAt: string;
  story: Story;
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  iconUrl?: string;
  points: number;
  requirements: Record<string, any>;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  achievement: Achievement;
}

export interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  totalPoints: number;
  earnedPoints: number;
  completionPercentage: number;
}

// Discovery Types
export interface DiscoverStoriesData {
  search?: string;
  category?: string;
  tags?: string[];
  minRating?: number;
  sortBy?: 'rating' | 'popularity' | 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

export interface DiscoverStoriesResponse {
  stories: Story[];
  pagination: PaginationMeta;
  filters: {
    categories: string[];
    tags: string[];
  };
}

// Query/Filter Types
export interface GetPaginatedData {
  page?: number;
  limit?: number;
}

export interface FindRpgTemplatesData extends GetPaginatedData {
  search?: string;
  isPublic?: boolean;
}

// Response wrapper types for common patterns
export type AuthApiResponse = ApiResponse<AuthResponse>;
export type UserApiResponse = ApiResponse<User>;
export type PublicUserApiResponse = ApiResponse<PublicUser>;
export type StoryApiResponse = ApiResponse<Story>;
export type StoriesApiResponse = ApiResponse<StoriesResponse>;
export type PlaySessionApiResponse = ApiResponse<PlaySession>;
export type RpgTemplateApiResponse = ApiResponse<RpgTemplate>;
export type RpgTemplatesApiResponse = ApiResponse<RpgTemplate[]>;
export type AchievementsApiResponse = ApiResponse<Achievement[]>;
export type UserAchievementsApiResponse = ApiResponse<UserAchievement[]>;
export type AchievementStatsApiResponse = ApiResponse<AchievementStats>;

// Legacy compatibility types (keep existing names for backward compatibility)
export interface RpgTemplateConfig {
  stats: string[];
  skills: string[];
  attributes?: string[];
  checkTypes?: string[];
  diceSystem?: string;
}

export interface RpgStat {
  id: string;
  name: string;
  type: 'integer' | 'decimal' | 'boolean';
  defaultValue: any;
  minValue?: number;
  maxValue?: number;
  description?: string;
}

export interface RpgSkill {
  id: string;
  name: string;
  type: 'integer' | 'decimal' | 'boolean';
  defaultValue: any;
  minValue?: number;
  maxValue?: number;
  description?: string;
}

export interface RpgAttribute {
  id: string;
  name: string;
  type: 'integer' | 'decimal' | 'boolean' | 'string';
  defaultValue: any;
  description?: string;
}

export interface RpgCheck {
  stat?: string;
  skill?: string;
  difficulty: number;
  successNodeId: string;
  failureNodeId: string;
}

export interface Condition {
  type: 'variable' | 'stat' | 'skill' | 'item';
  target: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte';
  value: any;
}

export interface Effect {
  type: 'variable' | 'stat' | 'skill' | 'item';
  target: string;
  operation: 'set' | 'add' | 'subtract' | 'multiply' | 'divide';
  value: any;
}