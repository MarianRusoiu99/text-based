import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:3000';

interface ChoiceCondition {
  type: string;
  value: string | number | boolean;
}

interface ChoiceEffect {
  type: string;
  value: string | number | boolean;
}

interface ChoiceNode {
  id: string;
  title: string;
}

interface Choice {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  choiceText: string;
  conditions?: ChoiceCondition[];
  effects?: ChoiceEffect[];
  createdAt: string;
  updatedAt: string;
  fromNode: ChoiceNode;
  toNode: ChoiceNode;
}

interface ChoicesResponse {
  success: boolean;
  data: Choice[];
}

interface CreateChoiceData {
  fromNodeId: string;
  toNodeId: string;
  choiceText: string;
  conditions?: ChoiceCondition[];
  effects?: ChoiceEffect[];
}

interface UpdateChoiceData {
  toNodeId?: string;
  choiceText?: string;
  conditions?: ChoiceCondition[];
  effects?: ChoiceEffect[];
}

class ChoicesService {
  private getAuthHeaders(): Record<string, string> {
    const token = useAuthStore.getState().accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getChoices(storyId: string) {
    const response = await fetch(`${API_BASE_URL}/choices/story/${storyId}`, {
      headers: this.getAuthHeaders(),
    });

    const result: ChoicesResponse = await response.json();
    return result;
  }

  async createChoice(data: CreateChoiceData) {
    const response = await fetch(`${API_BASE_URL}/choices`, {
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

  async updateChoice(id: string, data: UpdateChoiceData) {
    const response = await fetch(`${API_BASE_URL}/choices/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  }

  async deleteChoice(id: string) {
    const response = await fetch(`${API_BASE_URL}/choices/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const result = await response.json();
    return result;
  }
}

export const choicesService = new ChoicesService();
