import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:3000';

interface NodeContent {
  character?: string;
  background?: string;
  text?: string;
}

interface NodePosition {
  x: number;
  y: number;
}

interface Node {
  id: string;
  storyId: string;
  chapterId?: string;
  nodeType: string;
  title: string;
  content: NodeContent | string;
  position: NodePosition;
  createdAt: string;
  updatedAt: string;
}

interface NodesResponse {
  success: boolean;
  data: Node[];
}

interface NodeResponse {
  success: boolean;
  data: Node;
}

interface CreateNodeData {
  storyId: string;
  chapterId?: string;
  nodeType?: string;
  title: string;
  content: NodeContent | string;
  position: NodePosition;
}

interface UpdateNodeData {
  chapterId?: string;
  nodeType?: string;
  title?: string;
  content?: NodeContent | string;
  position?: NodePosition;
}

class NodesService {
  private getAuthHeaders(): Record<string, string> {
    const token = useAuthStore.getState().accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getNodes(storyId: string) {
    const response = await fetch(`${API_BASE_URL}/nodes/story/${storyId}`, {
      headers: this.getAuthHeaders(),
    });

    const result: NodesResponse = await response.json();
    return result;
  }

  async getNode(id: string) {
    const response = await fetch(`${API_BASE_URL}/nodes/${id}`, {
      headers: this.getAuthHeaders(),
    });

    const result: NodeResponse = await response.json();
    return result;
  }

  async createNode(data: CreateNodeData) {
    const response = await fetch(`${API_BASE_URL}/nodes`, {
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

  async updateNode(id: string, data: UpdateNodeData) {
    const response = await fetch(`${API_BASE_URL}/nodes/${id}`, {
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

  async deleteNode(id: string) {
    const response = await fetch(`${API_BASE_URL}/nodes/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const result = await response.json();
    return result;
  }
}

export const nodesService = new NodesService();
