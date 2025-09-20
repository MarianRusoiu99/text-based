/**
 * Single source of truth for all API endpoints
 * This file declares all endpoints and their expected parameters/responses
 * Updated to match the comprehensive backend API documentation
 */

const API_BASE_URL = 'http://localhost:3000/api';

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_EMAIL_TEST: '/auth/verify-email-test',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // User Management endpoints
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    PUBLIC_PROFILE: (userId: string) => `/users/${userId}`,
  },

  // Stories endpoints
  STORIES: {
    BASE: '/stories',
    BY_ID: (id: string) => `/stories/${id}`,
    PUBLISH: (id: string) => `/stories/${id}/publish`,
    
    // Chapter management
    CHAPTERS: (storyId: string) => `/stories/${storyId}/chapters`,
    CHAPTER_BY_ID: (storyId: string, chapterId: string) => `/stories/${storyId}/chapters/${chapterId}`,
    REORDER_CHAPTERS: (storyId: string) => `/stories/${storyId}/chapters/reorder`,
    
    // Story variables
    VARIABLES: (storyId: string) => `/stories/${storyId}/variables`,
    VARIABLE_BY_ID: (storyId: string, variableId: string) => `/stories/${storyId}/variables/${variableId}`,
    
    // Story items
    ITEMS: (storyId: string) => `/stories/${storyId}/items`,
    ITEM_BY_ID: (storyId: string, itemId: string) => `/stories/${storyId}/items/${itemId}`,
    
    // Story nodes
    NODES: (storyId: string) => `/stories/${storyId}/nodes`,
  },

  // Node Management endpoints
  NODES: {
    BY_ID: (nodeId: string) => `/nodes/${nodeId}`,
    CHOICES: (fromNodeId: string) => `/nodes/${fromNodeId}/choices`,
  },

  // Choice Management endpoints
  CHOICES: {
    BY_ID: (choiceId: string) => `/choices/${choiceId}`,
    BY_STORY: (storyId: string) => `/choices/story/${storyId}`,
  },

  // RPG Templates endpoints
  RPG_TEMPLATES: {
    BASE: '/rpg-templates',
    BY_ID: (id: string) => `/rpg-templates/${id}`,
  },

  // Player/Gameplay endpoints
  PLAYER: {
    SESSIONS: '/player/sessions',
    SESSION_BY_ID: (sessionId: string) => `/player/sessions/${sessionId}`,
    SESSION_DETAILS: (sessionId: string) => `/player/sessions/${sessionId}/details`,
    MAKE_CHOICE: (sessionId: string) => `/player/sessions/${sessionId}/choices`,
    UPDATE_GAME_STATE: (sessionId: string) => `/player/sessions/${sessionId}`,
    SAVE_GAME: (sessionId: string) => `/player/sessions/${sessionId}/save`,
    LOAD_GAME: '/player/saved-games/load',
    SAVED_GAMES: '/player/saved-games',
    DELETE_SAVED_GAME: (savedGameId: string) => `/player/saved-games/${savedGameId}`,
  },

  // Social Features endpoints
  SOCIAL: {
    // Following
    FOLLOW_USER: (userId: string) => `/social/users/${userId}/follow`,
    UNFOLLOW_USER: (userId: string) => `/social/users/${userId}/follow`,
    GET_FOLLOWERS: (userId: string) => `/social/users/${userId}/followers`,
    GET_FOLLOWING: (userId: string) => `/social/users/${userId}/following`,
    IS_FOLLOWING: (userId: string) => `/social/users/${userId}/is-following`,
    
    // Ratings and Reviews
    RATE_STORY: (storyId: string) => `/social/stories/${storyId}/rate`,
    GET_USER_RATING: (storyId: string) => `/social/stories/${storyId}/rating`,
    GET_STORY_RATINGS: (storyId: string) => `/social/stories/${storyId}/ratings`,
    
    // Comments
    ADD_COMMENT: (storyId: string) => `/social/stories/${storyId}/comments`,
    GET_COMMENTS: (storyId: string) => `/social/stories/${storyId}/comments`,
    DELETE_COMMENT: (commentId: string) => `/social/comments/${commentId}`,
    
    // Bookmarks
    BOOKMARK_STORY: (storyId: string) => `/social/stories/${storyId}/bookmark`,
    UNBOOKMARK_STORY: (storyId: string) => `/social/stories/${storyId}/bookmark`,
    GET_BOOKMARKS: '/social/bookmarks',
    IS_BOOKMARKED: (storyId: string) => `/social/stories/${storyId}/is-bookmarked`,
  },

  // Achievement endpoints
  ACHIEVEMENTS: {
    BASE: '/achievements',
    USER_ACHIEVEMENTS: '/achievements/user',
    ACHIEVEMENT_STATS: '/achievements/stats',
  },

  // Discovery endpoints
  DISCOVERY: {
    STORIES: '/discovery/stories',
    FEATURED: '/discovery/featured',
    TRENDING: '/discovery/trending',
    RECOMMENDED: '/discovery/recommended',
    CATEGORIES: '/discovery/categories',
    TAGS: '/discovery/tags',
  },
} as const;

export { API_BASE_URL };