import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { rpgService, type RpgTemplate, type RpgStat } from '../services/rpgService';

interface CharacterStats {
  [key: string]: any;
}

interface CharacterCreatorProps {
  rpgTemplateId?: string;
  onCharacterCreated: (character: { name: string; stats: CharacterStats }) => void;
  onCancel: () => void;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  rpgTemplateId,
  onCharacterCreated,
  onCancel
}) => {
  const [characterName, setCharacterName] = useState('');
  const [rpgTemplate, setRpgTemplate] = useState<RpgTemplate | null>(null);
  const [characterStats, setCharacterStats] = useState<CharacterStats>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!rpgTemplateId) return;
      
      try {
        setIsLoading(true);
        const template = await rpgService.getTemplate(rpgTemplateId);
        setRpgTemplate(template);
        
        // Initialize character stats with default values
        const initialStats: CharacterStats = {};
        template.stats.forEach(stat => {
          initialStats[stat.id] = stat.defaultValue;
        });
        template.skills?.forEach(skill => {
          initialStats[skill.id] = skill.defaultValue;
        });
        setCharacterStats(initialStats);
      } catch (err) {
        setError('Failed to load RPG template');
        console.error('Error loading RPG template:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [rpgTemplateId]);

  const handleStatChange = (statId: string, value: any) => {
    setCharacterStats(prev => ({
      ...prev,
      [statId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName.trim()) {
      setError('Character name is required');
      return;
    }

    onCharacterCreated({
      name: characterName,
      stats: characterStats
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading character creation...</div>
      </div>
    );
  }

  if (!rpgTemplate) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Create Character</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Character Name
            </label>
            <Input
              data-testid="character-name-input"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter character name"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1" data-testid="create-character-btn">
              Create Character
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Create Character</h2>
        <p className="text-gray-600">
          Using RPG Template: <strong>{rpgTemplate.name}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Character Name
          </label>
          <Input
            data-testid="character-name-input"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter character name"
            required
          />
        </div>

        {/* Character Stats */}
        {rpgTemplate.stats.length > 0 && (
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Character Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {rpgTemplate.stats.map((stat) => (
                <div key={stat.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {stat.name}
                  </label>
                  {stat.type === 'integer' ? (
                    <Input
                      type="number"
                      value={characterStats[stat.id] || stat.defaultValue}
                      onChange={(e) => handleStatChange(stat.id, parseInt(e.target.value) || stat.defaultValue)}
                      min={stat.minValue}
                      max={stat.maxValue}
                      data-testid={`character-stat-${stat.name}`}
                    />
                  ) : stat.type === 'boolean' ? (
                    <select
                      value={characterStats[stat.id] || stat.defaultValue}
                      onChange={(e) => handleStatChange(stat.id, e.target.value === 'true')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      data-testid={`character-stat-${stat.name}`}
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : (
                    <Input
                      value={characterStats[stat.id] || stat.defaultValue}
                      onChange={(e) => handleStatChange(stat.id, e.target.value)}
                      data-testid={`character-stat-${stat.name}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Character Skills */}
        {rpgTemplate.skills && rpgTemplate.skills.length > 0 && (
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Character Skills</h3>
            <div className="grid grid-cols-2 gap-4">
              {rpgTemplate.skills.map((skill) => (
                <div key={skill.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {skill.name}
                  </label>
                  {skill.type === 'integer' ? (
                    <Input
                      type="number"
                      value={characterStats[skill.id] || skill.defaultValue}
                      onChange={(e) => handleStatChange(skill.id, parseInt(e.target.value) || skill.defaultValue)}
                      min={skill.minValue}
                      max={skill.maxValue}
                      data-testid={`character-skill-${skill.name}`}
                    />
                  ) : skill.type === 'boolean' ? (
                    <select
                      value={characterStats[skill.id] || skill.defaultValue}
                      onChange={(e) => handleStatChange(skill.id, e.target.value === 'true')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      data-testid={`character-skill-${skill.name}`}
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : (
                    <Input
                      value={characterStats[skill.id] || skill.defaultValue}
                      onChange={(e) => handleStatChange(skill.id, e.target.value)}
                      data-testid={`character-skill-${skill.name}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-2">
          <Button type="submit" className="flex-1" data-testid="create-character-btn">
            Create Character
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};