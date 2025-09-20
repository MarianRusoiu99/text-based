import { choiceApi, type Choice, type CreateChoiceData, type UpdateChoiceData, ApiException } from '../lib/api';

class ChoicesService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getChoices(_storyId: string): Promise<{ success: boolean; data: Choice[] }> {
    try {
      // For now, we'll return empty array since this endpoint needs clarification
      // TODO: Implement proper choices fetching when backend endpoint is ready
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching choices:', error);
      return { success: false, data: [] };
    }
  }

  async getNodeChoices(nodeId: string): Promise<{ success: boolean; data: Choice[] }> {
    try {
      const response = await choiceApi.getNodeChoices(nodeId);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error fetching node choices:', error);
      return { success: false, data: [] };
    }
  }

  async createChoice(data: CreateChoiceData): Promise<{ success: boolean; data?: Choice; message?: string }> {
    try {
      const response = await choiceApi.createChoice(data);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Choice created successfully'
        };
      }
      
      return {
        success: false,
        message: 'Failed to create choice'
      };
    } catch (error) {
      console.error('Error creating choice:', error);
      if (error instanceof ApiException) {
        return {
          success: false,
          message: error.message
        };
      }
      return {
        success: false,
        message: 'Failed to create choice'
      };
    }
  }

  async getChoice(id: string): Promise<{ success: boolean; data?: Choice; message?: string }> {
    try {
      const response = await choiceApi.getChoice(id);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        message: 'Choice not found'
      };
    } catch (error) {
      console.error('Error fetching choice:', error);
      if (error instanceof ApiException) {
        return {
          success: false,
          message: error.message
        };
      }
      return {
        success: false,
        message: 'Failed to fetch choice'
      };
    }
  }

  async updateChoice(id: string, data: UpdateChoiceData): Promise<{ success: boolean; data?: Choice; message?: string }> {
    try {
      const response = await choiceApi.updateChoice(id, data);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Choice updated successfully'
        };
      }
      
      return {
        success: false,
        message: 'Failed to update choice'
      };
    } catch (error) {
      console.error('Error updating choice:', error);
      if (error instanceof ApiException) {
        return {
          success: false,
          message: error.message
        };
      }
      return {
        success: false,
        message: 'Failed to update choice'
      };
    }
  }

  async deleteChoice(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await choiceApi.deleteChoice(id);
      
      return {
        success: response.success,
        message: response.message || 'Choice deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting choice:', error);
      if (error instanceof ApiException) {
        return {
          success: false,
          message: error.message
        };
      }
      return {
        success: false,
        message: 'Failed to delete choice'
      };
    }
  }
}

export const choicesService = new ChoicesService();