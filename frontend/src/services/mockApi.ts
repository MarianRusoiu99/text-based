/**
 * Mock API for development and testing when backend is not available
 * This allows frontend testing without needing a full backend setup
 */

let mockUsers: any[] = [];
let mockStories: any[] = [];
let mockTemplates: any[] = [
  {
    id: 'template-1',
    name: 'Fantasy Adventure System',
    description: 'Classic fantasy RPG with stats and skills',
    stats: [
      { id: 'strength', name: 'strength', type: 'integer', defaultValue: 10, minValue: 1, maxValue: 20 },
      { id: 'intelligence', name: 'intelligence', type: 'integer', defaultValue: 10, minValue: 1, maxValue: 20 },
      { id: 'dexterity', name: 'dexterity', type: 'integer', defaultValue: 10, minValue: 1, maxValue: 20 },
      { id: 'charisma', name: 'charisma', type: 'integer', defaultValue: 10, minValue: 1, maxValue: 20 },
    ],
    skills: [
      { id: 'swordplay', name: 'swordplay', type: 'integer', defaultValue: 0, minValue: 0, maxValue: 100 },
      { id: 'magic', name: 'magic', type: 'integer', defaultValue: 0, minValue: 0, maxValue: 100 },
    ],
    checkTypes: ['stat', 'skill', 'luck']
  }
];

export const mockApi = {
  // Auth endpoints
  async register(userData: any) {
    const existingUser = mockUsers.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      passwordHash: 'hashed-password',
      createdAt: new Date().toISOString(),
      isVerified: true, // Auto-verify for testing
    };
    mockUsers.push(newUser);
    
    return {
      success: true,
      data: {
        user: { id: newUser.id, username: newUser.username, email: newUser.email, displayName: newUser.displayName },
        token: 'mock-jwt-token',
      }
    };
  },

  async login(credentials: any) {
    const user = mockUsers.find(u => u.email === credentials.email || u.username === credentials.email);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      success: true,
      data: {
        user: { id: user.id, username: user.username, email: user.email, displayName: user.displayName },
        token: 'mock-jwt-token',
      }
    };
  },

  // Story endpoints
  async createStory(storyData: any) {
    const newStory = {
      id: `story-${Date.now()}`,
      ...storyData,
      authorId: 'current-user-id',
      createdAt: new Date().toISOString(),
      isPublished: false,
    };
    mockStories.push(newStory);
    
    return {
      success: true,
      data: newStory
    };
  },

  async getStories() {
    return {
      success: true,
      data: mockStories
    };
  },

  // RPG Template endpoints
  async getRpgTemplates() {
    return {
      success: true,
      data: mockTemplates
    };
  },

  async createRpgTemplate(templateData: any) {
    const newTemplate = {
      id: `template-${Date.now()}`,
      ...templateData,
      createdAt: new Date().toISOString(),
    };
    mockTemplates.push(newTemplate);
    
    return {
      success: true,
      data: newTemplate
    };
  },

  async getRpgTemplate(templateId: string) {
    const template = mockTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    return {
      success: true,
      data: template
    };
  },

  // Node endpoints
  async createNode(nodeData: any) {
    const newNode = {
      id: `node-${Date.now()}`,
      ...nodeData,
      createdAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      data: newNode
    };
  },

  async updateNode(nodeId: string, nodeData: any) {
    return {
      success: true,
      data: { id: nodeId, ...nodeData }
    };
  },

  // Variables endpoints
  async getVariables(_storyId: string) {
    return [];
  },

  async createVariable(storyId: string, variableData: any) {
    const newVariable = {
      id: `var-${Date.now()}`,
      storyId,
      ...variableData,
    };
    return newVariable;
  },

  // Items endpoints
  async getItems(_storyId: string) {
    return [];
  },

  async createItem(storyId: string, itemData: any) {
    const newItem = {
      id: `item-${Date.now()}`,
      storyId,
      ...itemData,
    };
    return newItem;
  }
};

// Enable mock mode for development
export const enableMockMode = () => {
  (window as any).__MOCK_API_ENABLED__ = true;
};

export const isMockMode = () => {
  return (window as any).__MOCK_API_ENABLED__ === true;
};