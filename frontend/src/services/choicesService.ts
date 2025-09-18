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
    // For now, we'll get all nodes with their choices included
    // TODO: Add a dedicated choices endpoint if needed
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/nodes`, {
      headers: this.getAuthHeaders(),
    });

    const result: { success: boolean; data: any[] } = await response.json();
    if (result.success) {
      // Extract choices from nodes
      const choices: Choice[] = [];
      result.data.forEach(node => {
        if (node.fromChoices) {
          node.fromChoices.forEach((choice: any) => {
            choices.push({
              ...choice,
              fromNode: { id: node.id, title: node.title },
              toNode: choice.toNode ? { id: choice.toNode.id, title: choice.toNode.title } : undefined,
            });
          });
        }
      });
      return { success: true, data: choices };
    }
    return result;
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
