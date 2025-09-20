/**
 * RPG Service for managing RPG templates and mechanics
 * Now uses the centralized API service
 */

import { rpgTemplateApi, type RpgTemplate, type UpdateRpgTemplateData } from '../lib/api';

// Re-export types for backward compatibility
export type { RpgTemplate, RpgStat, RpgSkill, RpgCheck, RpgTemplateConfig } from '../lib/api/types';

export interface CreateRpgTemplateDto {
  name: string;
  description?: string;
  version?: string;
  isPublic?: boolean;
  config: {
    stats: Array<{
      id: string;
      name: string;
      type: 'integer' | 'decimal' | 'boolean';
      defaultValue: any;
      minValue?: number;
      maxValue?: number;
      description?: string;
    }>;
    skills: Array<{
      id: string;
      name: string;
      type: 'integer' | 'decimal' | 'boolean';
      defaultValue: any;
      minValue?: number;
      maxValue?: number;
      description?: string;
    }>;
    checkTypes: string[];
  };
}

class RpgService {
  async getTemplates(): Promise<RpgTemplate[]> {
    try {
      const response = await rpgTemplateApi.getTemplates({ isPublic: true });
      if (response.success && response.data) {
        // Backend returns { templates: [], pagination: {} } structure
        const templates = response.data.templates;
        // Ensure we always return an array
        return Array.isArray(templates) ? templates : [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching RPG templates:', error);
      return [];
    }
  }

  async createTemplate(templateData: CreateRpgTemplateDto): Promise<RpgTemplate | null> {
    try {
      const response = await rpgTemplateApi.createTemplate(templateData);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating RPG template:', error);
      throw error;
    }
  }

  async getTemplate(templateId: string): Promise<RpgTemplate | null> {
    try {
      const response = await rpgTemplateApi.getTemplate(templateId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching RPG template:', error);
      throw error;
    }
  }

  async updateTemplate(templateId: string, templateData: UpdateRpgTemplateData): Promise<RpgTemplate | null> {
    try {
      const response = await rpgTemplateApi.updateTemplate(templateId, templateData);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating RPG template:', error);
      throw error;
    }
  }

  async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      const response = await rpgTemplateApi.deleteTemplate(templateId);
      return response.success;
    } catch (error) {
      console.error('Error deleting RPG template:', error);
      throw error;
    }
  }
}

export const rpgService = new RpgService();