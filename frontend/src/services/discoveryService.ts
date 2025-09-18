import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:3000';

export interface StoryFilters {
  search?: string;
  category?: string;
  tags?: string[];
  authorId?: string;
  minRating?: number;
  maxRating?: number;
  sortBy?: 'newest' | 'oldest' | 'rating' | 'popular' | 'trending';
  page?: number;
  limit?: number;
}

export interface Story {
  id: string;
  title: string;
  description?: string;
  author: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  tags: string[];
  category?: string;
  coverImageUrl?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  publishedAt?: string;
  createdAt: string;
  averageRating?: number;
  totalRatings?: number;
  totalComments?: number;
  totalPlays?: number;
  recentPlays?: number;
}

export interface DiscoveryResponse {
  success: boolean;
  data: {
    stories: Story[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filters?: {
      applied: StoryFilters;
    };
  };
}

export interface CategoryStats {
  name: string;
  count: number;
}

export interface TagStats {
  name: string;
  count: number;
}

class DiscoveryService {
  private getAuthHeaders(): Record<string, string> {
    const token = useAuthStore.getState().accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async discoverStories(filters: StoryFilters = {}): Promise<DiscoveryResponse> {
    const query = new URLSearchParams();

    // Add filters to query params
    if (filters.search) query.append('search', filters.search);
    if (filters.category) query.append('category', filters.category);
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => query.append('tags', tag));
    }
    if (filters.authorId) query.append('authorId', filters.authorId);
    if (filters.minRating !== undefined) query.append('minRating', filters.minRating.toString());
    if (filters.maxRating !== undefined) query.append('maxRating', filters.maxRating.toString());
    if (filters.sortBy) query.append('sortBy', filters.sortBy);
    if (filters.page) query.append('page', filters.page.toString());
    if (filters.limit) query.append('limit', filters.limit.toString());

    const response = await fetch(`${API_BASE_URL}/discovery/stories?${query}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to discover stories: ${response.statusText}`);
    }

    const result: DiscoveryResponse = await response.json();
    return result;
  }

  async getFeaturedStories(limit = 10): Promise<{ success: boolean; data: Story[] }> {
    const query = new URLSearchParams();
    if (limit) query.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/discovery/featured?${query}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get featured stories: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  async getTrendingStories(limit = 10): Promise<{ success: boolean; data: Story[] }> {
    const query = new URLSearchParams();
    if (limit) query.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/discovery/trending?${query}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get trending stories: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  async getRecommendedStories(limit = 10): Promise<{ success: boolean; data: Story[] }> {
    const query = new URLSearchParams();
    if (limit) query.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/discovery/recommended?${query}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get recommended stories: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  async getCategories(): Promise<{ success: boolean; data: CategoryStats[] }> {
    const response = await fetch(`${API_BASE_URL}/discovery/categories`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get categories: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  async getTags(limit = 50): Promise<{ success: boolean; data: TagStats[] }> {
    const query = new URLSearchParams();
    if (limit) query.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/discovery/tags?${query}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get tags: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }
}

export const discoveryService = new DiscoveryService();