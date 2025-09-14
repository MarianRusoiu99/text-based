import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:3000';

interface Story {
  id: string;
  title: string;
  description?: string;
  author: {
    id: string;
    username: string;
    displayName?: string;
  };
  createdAt: string;
  isPublished: boolean;
}

interface StoriesResponse {
  success: boolean;
  data: {
    stories: Story[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

class StoriesService {
  private getAuthHeaders(): Record<string, string> {
    const token = useAuthStore.getState().accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getStories(params: { page?: number; limit?: number; search?: string } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/stories?${query}`, {
      headers: this.getAuthHeaders(),
    });

    const result: StoriesResponse = await response.json();
    return result;
  }

  async createStory(data: { title: string; description?: string; visibility?: string }) {
    const response = await fetch(`${API_BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  }

  async publishStory(id: string, isPublished: boolean) {
    const response = await fetch(`${API_BASE_URL}/stories/${id}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ isPublished }),
    });

    const result = await response.json();
    return result;
  }
}

export const storiesService = new StoriesService();
