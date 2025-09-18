import { useAuthStore } from '../stores/authStore';

const API_BASE = '/api/player';

interface StartPlaySessionRequest {
  storyId: string;
  startingNodeId?: string;
}

interface MakeChoiceRequest {
  choiceId: string;
  gameStateUpdate?: Record<string, unknown>;
}

interface UpdateGameStateRequest {
  currentNodeId?: string;
  gameState?: Record<string, unknown>;
  isCompleted?: boolean;
}

interface SaveGameRequest {
  saveName?: string;
}

interface LoadGameRequest {
  savedGameId: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PlaySession {
  id: string;
  storyId: string;
  currentNodeId: string;
  gameState: Record<string, unknown>;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Node {
  id: string;
  title: string;
  content: Record<string, unknown> | string;
  position: { x: number; y: number };
}

interface Choice {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  choiceText: string;
  conditions?: Record<string, unknown>[];
  effects?: Record<string, unknown>[];
}

interface CurrentNodeResponse {
  session: PlaySession;
  node: Node;
  choices: Choice[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  unlockedAt: string;
}

interface MakeChoiceResponse {
  session: PlaySession;
  nextNode: Node;
  unlockedAchievements?: Achievement[];
}

interface StartSessionResponse {
  session: PlaySession & { story: Record<string, unknown> };
  currentNode: Node;
  unlockedAchievements?: Achievement[];
}

interface SavedGame {
  id: string;
  saveName: string;
  sessionId: string;
  storyId: string;
  gameState: Record<string, unknown>;
  currentNodeId: string;
  createdAt: string;
}

class PlayerService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = useAuthStore.getState().accessToken;

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async startPlaySession(request: StartPlaySessionRequest): Promise<StartSessionResponse> {
    const response = await this.request<StartSessionResponse>('/sessions', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.data;
  }

  async getCurrentNode(sessionId: string): Promise<CurrentNodeResponse> {
    const response = await this.request<CurrentNodeResponse>(`/sessions/${sessionId}`);
    return response.data;
  }

  async makeChoice(sessionId: string, request: MakeChoiceRequest): Promise<MakeChoiceResponse> {
    const response = await this.request<MakeChoiceResponse>(`/sessions/${sessionId}/choices`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.data;
  }

  async updateGameState(sessionId: string, request: UpdateGameStateRequest): Promise<PlaySession> {
    const response = await this.request<PlaySession>(`/sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
    return response.data;
  }

  async getPlaySessions(storyId?: string): Promise<PlaySession[]> {
    const query = storyId ? `?storyId=${storyId}` : '';
    const response = await this.request<PlaySession[]>(`/sessions${query}`);
    return response.data;
  }

  async getPlaySession(sessionId: string): Promise<PlaySession> {
    const response = await this.request<PlaySession>(`/sessions/${sessionId}/details`);
    return response.data;
  }

  async saveGame(sessionId: string, request: SaveGameRequest = {}): Promise<SavedGame> {
    const response = await this.request<SavedGame>(`/sessions/${sessionId}/save`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.data;
  }

  async loadGame(request: LoadGameRequest): Promise<StartSessionResponse> {
    const response = await this.request<StartSessionResponse>('/saved-games/load', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.data;
  }

  async getSavedGames(storyId?: string): Promise<SavedGame[]> {
    const query = storyId ? `?storyId=${storyId}` : '';
    const response = await this.request<SavedGame[]>(`/saved-games${query}`);
    return response.data;
  }

  async deleteSavedGame(savedGameId: string): Promise<void> {
    await this.request(`/saved-games/${savedGameId}`, {
      method: 'DELETE',
    });
  }
}

export const playerService = new PlayerService();
export type {
  PlaySession,
  Node,
  Choice,
  Achievement,
  CurrentNodeResponse,
  MakeChoiceResponse,
  StartSessionResponse,
  SavedGame,
  StartPlaySessionRequest,
  MakeChoiceRequest,
  UpdateGameStateRequest,
  SaveGameRequest,
  LoadGameRequest,
};