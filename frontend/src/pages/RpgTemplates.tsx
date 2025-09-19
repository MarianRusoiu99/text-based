import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { rpgService, type RpgStat, type CreateRpgTemplateDto } from '../services/rpgService';

const RpgTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [stats, setStats] = useState<Omit<RpgStat, 'id'>[]>([
    { name: 'strength', type: 'integer', defaultValue: 10, minValue: 1, maxValue: 20 },
    { name: 'intelligence', type: 'integer', defaultValue: 10, minValue: 1, maxValue: 20 },
    { name: 'dexterity', type: 'integer', defaultValue: 10, minValue: 1, maxValue: 20 },
  ]);
  const [skills, setSkills] = useState<Omit<RpgStat, 'id'>[]>([
    { name: 'swordplay', type: 'integer', defaultValue: 0, minValue: 0, maxValue: 100 },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddStat = () => {
    setStats([...stats, { name: '', type: 'integer', defaultValue: 10, minValue: 1, maxValue: 20 }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleStatChange = (index: number, field: keyof Omit<RpgStat, 'id'>, value: any) => {
    const updatedStats = [...stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setStats(updatedStats);
  };

  const handleAddSkill = () => {
    setSkills([...skills, { name: '', type: 'integer', defaultValue: 0, minValue: 0, maxValue: 100 }]);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index: number, field: keyof Omit<RpgStat, 'id'>, value: any) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setSkills(updatedSkills);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const templateData: CreateRpgTemplateDto = {
        name: templateName,
        description: templateDescription,
        stats: stats.filter(stat => stat.name.trim() !== ''),
        skills: skills.filter(skill => skill.name.trim() !== ''),
        checkTypes: ['stat', 'skill', 'luck']
      };

      const result = await rpgService.createTemplate(templateData);
      navigate(`/rpg-templates/${result.id}`);
    } catch (err) {
      setError('Failed to create RPG template. Please try again.');
      console.error('Error creating RPG template:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create RPG Template</h1>
        <p className="text-gray-600">
          Design a flexible RPG system with custom stats, skills, and mechanics.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Template Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <Input
                data-testid="template-name-input"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Fantasy Adventure System"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                data-testid="template-description-input"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Describe the RPG system and its mechanics..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Character Stats</h2>
            <Button
              type="button"
              onClick={handleAddStat}
              variant="outline"
              size="sm"
              data-testid="add-stat-btn"
            >
              Add Stat
            </Button>
          </div>
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
                <Input
                  placeholder="Stat name (e.g., strength)"
                  value={stat.name}
                  onChange={(e) => handleStatChange(index, 'name', e.target.value)}
                  data-testid={`stat-name-input-${index}`}
                />
                <select
                  value={stat.type}
                  onChange={(e) => handleStatChange(index, 'type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  data-testid={`stat-type-select-${index}`}
                >
                  <option value="integer">Integer</option>
                  <option value="string">String</option>
                  <option value="boolean">Boolean</option>
                </select>
                <Input
                  type="number"
                  placeholder="Default"
                  value={stat.defaultValue}
                  onChange={(e) => handleStatChange(index, 'defaultValue', parseInt(e.target.value) || 0)}
                  data-testid={`stat-default-input-${index}`}
                />
                <Button
                  type="button"
                  onClick={() => handleRemoveStat(index)}
                  variant="outline"
                  size="sm"
                  data-testid={`remove-stat-btn-${index}`}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Character Skills</h2>
            <Button
              type="button"
              onClick={handleAddSkill}
              variant="outline"
              size="sm"
              data-testid="add-skill-btn"
            >
              Add Skill
            </Button>
          </div>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
                <Input
                  placeholder="Skill name (e.g., swordplay)"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  data-testid={`skill-name-input-${index}`}
                />
                <select
                  value={skill.type}
                  onChange={(e) => handleSkillChange(index, 'type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  data-testid={`skill-type-select-${index}`}
                >
                  <option value="integer">Integer</option>
                  <option value="string">String</option>
                  <option value="boolean">Boolean</option>
                </select>
                <Input
                  type="number"
                  placeholder="Default"
                  value={skill.defaultValue}
                  onChange={(e) => handleSkillChange(index, 'defaultValue', parseInt(e.target.value) || 0)}
                  data-testid={`skill-default-input-${index}`}
                />
                <Button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  variant="outline"
                  size="sm"
                  data-testid={`remove-skill-btn-${index}`}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading || !templateName.trim()}
            className="flex-1"
            data-testid="create-template-btn"
          >
            {isLoading ? 'Creating Template...' : 'Create RPG Template'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/stories')}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RpgTemplates;