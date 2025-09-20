/**
 * Centralized type definitions for API requests and responses
 * These types define the contract between frontend and backend
 */

// Common API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    pagination?: PaginationMeta;
    timestamp?: string;
    version?: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errorCode?: string;
  details?: any;
}

// Auth types
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

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalStories: number;
    totalFollowers: number;
    totalFollowing: number;
    totalRatings: number;
    totalComments: number;
    totalPlaySessions: number;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

// Story types
export interface Story {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  category?: string;
  tags: string[];
  isPublished: boolean;
  visibility: 'public' | 'unlisted' | 'private';
  authorId: string;
  rpgTemplateId?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    username: string;
    displayName?: string;
  };
  rpgTemplate?: RpgTemplate;
}

export interface CreateStoryData {
  title: string;
  description?: string;
  visibility?: 'public' | 'unlisted' | 'private';
  tags?: string[];
  rpgTemplateId?: string;
}

export interface UpdateStoryData {
  title?: string;
  description?: string;
  coverImageUrl?: string;
  category?: string;
  tags?: string[];
  visibility?: 'public' | 'unlisted' | 'private';
  rpgTemplateId?: string;
}

export interface StoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: string;
  visibility?: string;
  tags?: string[];
}

// RPG Template types
export interface RpgTemplateConfig {
  stats: RpgStat[];
  skills: RpgSkill[];
  attributes?: RpgAttribute[];
  checkTypes: string[];
  diceSystem?: string;
}

export interface RpgTemplate {
  id: string;
  name: string;
  description?: string;
  version: string;
  isPublic: boolean;
  creatorId: string;
  config: RpgTemplateConfig;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    username: string;
    displayName?: string;
  };
  // Backward compatibility with old interface
  stats?: RpgStat[];
  skills?: RpgSkill[];
  checkTypes?: string[];
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

export interface CreateRpgTemplateData {
  name: string;
  description?: string;
  version?: string;
  isPublic?: boolean;
  config: RpgTemplateConfig;
}

export interface UpdateRpgTemplateData {
  name?: string;
  description?: string;
  version?: string;
  isPublic?: boolean;
  config?: RpgTemplateConfig;
}

// Node types
export interface Node {
  id: string;
  title: string;
  content: string;
  nodeType: 'story' | 'choice' | 'condition' | 'rpg_check';
  storyId: string;
  chapterId?: string;
  position: { x: number; y: number };
  rpgCheck?: RpgCheck;
  createdAt: string;
  updatedAt: string;
}

export interface RpgCheck {
  stat?: string;
  skill?: string;
  difficulty: number;
  successNodeId: string;
  failureNodeId: string;
}

export interface CreateNodeData {
  title: string;
  content: string;
  nodeType: 'story' | 'choice' | 'condition' | 'rpg_check';
  storyId: string;
  chapterId?: string;
  position: { x: number; y: number };
  rpgCheck?: RpgCheck;
}

export interface UpdateNodeData {
  title?: string;
  content?: string;
  nodeType?: 'story' | 'choice' | 'condition' | 'rpg_check';
  position?: { x: number; y: number };
  rpgCheck?: RpgCheck;
}

// Choice types
export interface Choice {
  id: string;
  choiceText: string;
  fromNodeId: string;
  toNodeId: string;
  conditions?: Condition[];
  effects?: Effect[];
  createdAt: string;
  updatedAt: string;
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

export interface CreateChoiceData {
  choiceText: string;
  fromNodeId: string;
  toNodeId: string;
  conditions?: Condition[];
  effects?: Effect[];
}

export interface UpdateChoiceData {
  choiceText?: string;
  toNodeId?: string;
  conditions?: Condition[];
  effects?: Effect[];
}

// Play session types
export interface PlaySession {
  id: string;
  storyId: string;
  playerId: string;
  currentNodeId: string;
  gameState: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface StartSessionData {
  storyId: string;
}

export interface MakeChoiceData {
  choiceId: string;
}

// Variable types
export interface StoryVariable {
  id: string;
  name: string;
  type: 'boolean' | 'number' | 'string';
  defaultValue: any;
  storyId: string;
  description?: string;
}

export interface CreateVariableData {
  name: string;
  type: 'boolean' | 'number' | 'string';
  defaultValue: any;
  description?: string;
}

// Item types
export interface StoryItem {
  id: string;
  name: string;
  description?: string;
  storyId: string;
  properties: Record<string, any>;
}

export interface CreateItemData {
  name: string;
  description?: string;
  properties?: Record<string, any>;
}