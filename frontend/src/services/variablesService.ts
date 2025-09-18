import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:3000';

export interface StoryVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean';
  defaultValue?: string | number | boolean;
  description?: string;
  storyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVariableDto {
  name: string;
  type: 'string' | 'number' | 'boolean';
  defaultValue?: string | number | boolean;
  description?: string;
}

export interface UpdateVariableDto {
  name?: string;
  type?: 'string' | 'number' | 'boolean';
  defaultValue?: string | number | boolean;
  description?: string;
}

class VariablesService {
  private getAuthHeaders(): Record<string, string> {
    const token = useAuthStore.getState().accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getVariables(storyId: string): Promise<StoryVariable[]> {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/variables`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch variables');
    }

    const result = await response.json();
    return result.success ? result.data : [];
  }

  async createVariable(storyId: string, data: CreateVariableDto): Promise<StoryVariable> {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/variables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create variable');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to create variable');
    }

    return result.data;
  }

  async updateVariable(storyId: string, variableId: string, data: UpdateVariableDto): Promise<StoryVariable> {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/variables/${variableId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update variable');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to update variable');
    }

    return result.data;
  }

  async deleteVariable(storyId: string, variableId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/variables/${variableId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete variable');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete variable');
    }
  }
}

export const variablesService = new VariablesService();