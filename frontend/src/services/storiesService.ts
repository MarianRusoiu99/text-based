import { storyApi, type Story, type CreateStoryData, type UpdateStoryData, type StoryFilters, ApiException } from '../lib/api';

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
  async getStories(params: StoryFilters = {}): Promise<StoriesResponse> {
    try {
      const response = await storyApi.getStories(params);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            stories: response.data.stories || [],
            pagination: response.data.pagination || { page: 1, limit: 20, total: 0, pages: 0 }
          }
        };
      }
      
      return {
        success: false,
        data: {
          stories: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        }
      };
    } catch (error) {
      console.error('Error fetching stories:', error);
      return {
        success: false,
        data: {
          stories: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        }
      };
    }
  }

  async getStory(id: string): Promise<{ success: boolean; data?: Story; message?: string }> {
    try {
      const response = await storyApi.getStory(id);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        message: 'Story not found'
      };
    } catch (error) {
      console.error('Error fetching story:', error);
      if (error instanceof ApiException) {
        return {
          success: false,
          message: error.message
        };
      }
      return {
        success: false,
        message: 'Failed to fetch story'
      };
    }
  }

  async createStory(data: CreateStoryData): Promise<{ success: boolean; data?: Story; message?: string }> {
    try {
      const response = await storyApi.createStory(data);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Story created successfully'
        };
      }
      
      return {
        success: false,
        message: 'Failed to create story'
      };
    } catch (error) {
      console.error('Error creating story:', error);
      if (error instanceof ApiException) {
        return {
          success: false,
          message: error.message
        };
      }
      return {
        success: false,
        message: 'Failed to create story'
      };
    }
  }

  async updateStory(id: string, data: UpdateStoryData): Promise<{ success: boolean; data?: Story; message?: string }> {
    try {
      const response = await storyApi.updateStory(id, data);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Story updated successfully'
        };
      }
      
      return {
        success: false,
        message: 'Failed to update story'
      };
    } catch (error) {
      console.error('Error updating story:', error);
      if (error instanceof ApiException) {
        return {
          success: false,
          message: error.message
        };
      }
      return {
        success: false,
        message: 'Failed to update story'
      };
    }
  }

  async deleteStory(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await storyApi.deleteStory(id);
      
      return {
        success: response.success,
        message: response.message || 'Story deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting story:', error);
      if (error instanceof ApiException) {
        return {
          success: false,
          message: error.message
        };
      }
      return {
        success: false,
        message: 'Failed to delete story'
      };
    }
  }

  async publishStory(id: string, published: boolean): Promise<{ success: boolean; data?: Story; message?: string }> {
    try {
      const response = await storyApi.publishStory(id, published);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: response.message || `Story ${published ? 'published' : 'unpublished'} successfully`
        };
      }
      
      return {
        success: false,
        message: `Failed to ${published ? 'publish' : 'unpublish'} story`
      };
    } catch (error) {
      console.error(`Error ${published ? 'publishing' : 'unpublishing'} story:`, error);
      if (error instanceof ApiException) {
        return {
          success: false,
          message: error.message
        };
      }
      return {
        success: false,
        message: `Failed to ${published ? 'publish' : 'unpublish'} story`
      };
    }
  }
}

export const storiesService = new StoriesService();