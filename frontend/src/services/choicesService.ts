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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getChoices(_storyId: string) {
    // TODO: Implement proper choices fetching when backend endpoint is ready
    // For now, return empty array to prevent compilation errors
    return { success: true, data: [] };
  }

  async createChoice(data: CreateChoiceData) {
    const response = await fetch(`${API_BASE_URL}/stories/nodes/${data.fromNodeId}/choices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({
        toNodeId: data.toNodeId,
        choiceText: data.choiceText,
        conditions: data.conditions,
        effects: data.effects,
      }),
    });

    const result = await response.json();
    return result;
  }

  async updateChoice(id: string, data: UpdateChoiceData) {
    const response = await fetch(`${API_BASE_URL}/stories/choices/${id}`, {
      method: 'PUT',
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
    const response = await fetch(`${API_BASE_URL}/stories/choices/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const result = await response.json();
    return result;
  }
}

export const choicesService = new ChoicesService();
