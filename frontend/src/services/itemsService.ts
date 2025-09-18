import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:3000';

export interface StoryItem {
  id: string;
  name: string;
  description?: string;
  storyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDto {
  name: string;
  description?: string;
}

export interface UpdateItemDto {
  name?: string;
  description?: string;
}

class ItemsService {
  private getAuthHeaders(): Record<string, string> {
    const token = useAuthStore.getState().accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getItems(storyId: string): Promise<StoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/items`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }

    const result = await response.json();
    return result.success ? result.data : [];
  }

  async createItem(storyId: string, data: CreateItemDto): Promise<StoryItem> {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create item');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to create item');
    }

    return result.data;
  }

  async updateItem(storyId: string, itemId: string, data: UpdateItemDto): Promise<StoryItem> {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update item');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to update item');
    }

    return result.data;
  }

  async deleteItem(storyId: string, itemId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/items/${itemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete item');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete item');
    }
  }
}

export const itemsService = new ItemsService();