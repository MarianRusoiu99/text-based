/**
 * RPG Service for managing RPG templates and mechanics
 */

import { mockApi } from './mockApi';

export interface RpgStat {
  id: string;
  name: string;
  type: 'integer' | 'string' | 'boolean';
  defaultValue: any;
  minValue?: number;
  maxValue?: number;
}

export interface RpgCheck {
  id: string;
  type: 'stat' | 'skill' | 'luck';
  statId?: string;
  difficulty: number;
  successText: string;
  failureText: string;
}

export interface RpgTemplate {
  id: string;
  name: string;
  description: string;
  stats: RpgStat[];
  skills: RpgStat[];
  checkTypes: string[];
}

export interface CreateRpgTemplateDto {
  name: string;
  description: string;
  stats: Omit<RpgStat, 'id'>[];
  skills?: Omit<RpgStat, 'id'>[];
  checkTypes?: string[];
}

class RpgService {
  private baseUrl = 'http://localhost:3000/api';

  async getTemplates(): Promise<RpgTemplate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/rpg-templates`);
      if (!response.ok) throw new Error('Failed to fetch RPG templates');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching RPG templates, using mock API:', error);
      const result = await mockApi.getRpgTemplates();
      return result.data;
    }
  }

  async createTemplate(templateData: CreateRpgTemplateDto): Promise<RpgTemplate> {
    try {
      const response = await fetch(`${this.baseUrl}/rpg-templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
      });
      
      if (!response.ok) throw new Error('Failed to create RPG template');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating RPG template, using mock API:', error);
      const result = await mockApi.createRpgTemplate(templateData);
      return result.data;
    }
  }

  async getTemplate(templateId: string): Promise<RpgTemplate> {
    try {
      const response = await fetch(`${this.baseUrl}/rpg-templates/${templateId}`);
      if (!response.ok) throw new Error('Failed to fetch RPG template');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching RPG template, using mock API:', error);
      const result = await mockApi.getRpgTemplate(templateId);
      return result.data;
    }
  }
}

export const rpgService = new RpgService();