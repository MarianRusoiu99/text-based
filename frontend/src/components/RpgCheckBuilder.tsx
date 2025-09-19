import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface RpgCheck {
  id?: string;
  type: 'stat' | 'skill' | 'luck';
  statId?: string;
  difficulty: number;
  successText: string;
  failureText: string;
}

interface RpgCheckBuilderProps {
  isOpen: boolean;
  onSave: (rpgCheck: RpgCheck) => void;
  onCancel: () => void;
  initialData?: RpgCheck;
}

export const RpgCheckBuilder: React.FC<RpgCheckBuilderProps> = ({
  isOpen,
  onSave,
  onCancel,
  initialData
}) => {
  const [checkType, setCheckType] = useState<'stat' | 'skill' | 'luck'>(initialData?.type || 'stat');
  const [statId, setStatId] = useState(initialData?.statId || 'strength');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 10);
  const [successText, setSuccessText] = useState(initialData?.successText || '');
  const [failureText, setFailureText] = useState(initialData?.failureText || '');

  const handleSave = () => {
    const rpgCheck: RpgCheck = {
      id: initialData?.id,
      type: checkType,
      statId: checkType === 'stat' ? statId : undefined,
      difficulty,
      successText,
      failureText,
    };
    onSave(rpgCheck);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <h3 className="text-lg font-semibold mb-4">Add RPG Check</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Check Type</label>
            <select
              data-testid="check-type-select"
              value={checkType}
              onChange={(e) => setCheckType(e.target.value as 'stat' | 'skill' | 'luck')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="stat">Stat Check</option>
              <option value="skill">Skill Check</option>
              <option value="luck">Luck Check</option>
            </select>
          </div>

          {checkType === 'stat' && (
            <div>
              <label className="block text-sm font-medium mb-1">Stat</label>
              <select
                data-testid="check-stat-select"
                value={statId}
                onChange={(e) => setStatId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="strength">Strength</option>
                <option value="intelligence">Intelligence</option>
                <option value="dexterity">Dexterity</option>
                <option value="charisma">Charisma</option>
                <option value="wisdom">Wisdom</option>
                <option value="constitution">Constitution</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <Input
              data-testid="check-difficulty-input"
              type="number"
              value={difficulty}
              onChange={(e) => setDifficulty(parseInt(e.target.value) || 10)}
              min={1}
              max={30}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Success Text</label>
            <textarea
              data-testid="success-text-input"
              value={successText}
              onChange={(e) => setSuccessText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
              placeholder="Text to show on success..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Failure Text</label>
            <textarea
              data-testid="failure-text-input"
              value={failureText}
              onChange={(e) => setFailureText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
              placeholder="Text to show on failure..."
            />
          </div>

          <div className="flex space-x-2">
            <Button
              data-testid="save-rpg-check-btn"
              onClick={handleSave}
              disabled={!successText.trim() || !failureText.trim()}
              className="flex-1"
            >
              Save RPG Check
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};