/**
 * Single source of truth for all API endpoints
 * This file declares all endpoints and their expected parameters/responses
 */

const API_BASE_URL = 'http://localhost:3000/api';

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    UPDATE_PROFILE: '/auth/update-profile',
  },

  // Stories endpoints
  STORIES: {
    BASE: '/stories',
    BY_ID: (id: string) => `/stories/${id}`,
    PUBLISH: (id: string) => `/stories/${id}/publish`,
    UNPUBLISH: (id: string) => `/stories/${id}/unpublish`,
    NODES: (id: string) => `/stories/${id}/nodes`,
    VARIABLES: (id: string) => `/stories/${id}/variables`,
    ITEMS: (id: string) => `/stories/${id}/items`,
  },

  // RPG Templates endpoints
  RPG_TEMPLATES: {
    BASE: '/rpg-templates',
    BY_ID: (id: string) => `/rpg-templates/${id}`,
  },

  // Nodes endpoints
  NODES: {
    BASE: '/nodes',
    BY_ID: (id: string) => `/nodes/${id}`,
    CHOICES: (id: string) => `/nodes/${id}/choices`,
  },

  // Choices endpoints
  CHOICES: {
    BASE: '/choices',
    BY_ID: (id: string) => `/choices/${id}`,
  },

  // Play sessions endpoints
  PLAYER: {
    BASE: '/player',
    START: '/player/start',
    CONTINUE: (sessionId: string) => `/player/sessions/${sessionId}`,
    MAKE_CHOICE: (sessionId: string) => `/player/sessions/${sessionId}/choice`,
    SESSION_BY_ID: (sessionId: string) => `/player/sessions/${sessionId}`,
    SESSIONS: '/player/sessions',
  },

  // Users endpoints
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: (id: string) => `/users/${id}/profile`,
  },

  // Discovery endpoints
  DISCOVERY: {
    FEATURED: '/discovery/featured',
    POPULAR: '/discovery/popular',
    RECENT: '/discovery/recent',
    SEARCH: '/discovery/search',
  },

  // Social endpoints
  SOCIAL: {
    FOLLOW: (userId: string) => `/social/follow/${userId}`,
    UNFOLLOW: (userId: string) => `/social/unfollow/${userId}`,
    FOLLOWERS: (userId: string) => `/social/followers/${userId}`,
    FOLLOWING: (userId: string) => `/social/following/${userId}`,
  },

  // Achievements endpoints
  ACHIEVEMENTS: {
    BASE: '/achievements',
    USER: (userId: string) => `/achievements/user/${userId}`,
  },
} as const;

export { API_BASE_URL };