import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { variablesService } from '../services/variablesService';
import type { StoryVariable, CreateVariableDto, UpdateVariableDto } from '../services/variablesService';

interface VariablesPanelProps {
  storyId: string;
  isOpen: boolean;
  onToggle: () => void;
  onVariablesChange?: (variables: StoryVariable[]) => void;
}

export const VariablesPanel: React.FC<VariablesPanelProps> = ({
  storyId,
  isOpen,
  onToggle,
  onVariablesChange,
}) => {
  const [variables, setVariables] = useState<StoryVariable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVariable, setEditingVariable] = useState<StoryVariable | null>(null);

  // Form state
  const [variableName, setVariableName] = useState('');
  const [variableType, setVariableType] = useState<'string' | 'integer' | 'boolean'>('string');
  const [variableDefaultValue, setVariableDefaultValue] = useState<string>('');
  const [variableDescription, setVariableDescription] = useState('');

  const loadVariables = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await variablesService.getVariables(storyId);
      setVariables(data);
    } catch (err) {
      setError('Failed to load variables');
      console.error('Error loading variables:', err);
    } finally {
      setIsLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    if (isOpen && storyId) {
      loadVariables();
    }
  }, [isOpen, storyId, loadVariables]);

  useEffect(() => {
    onVariablesChange?.(variables);
  }, [variables, onVariablesChange]);

  const resetForm = () => {
    setVariableName('');
    setVariableType('string');
    setVariableDefaultValue('');
    setVariableDescription('');
    setEditingVariable(null);
    setShowCreateForm(false);
  };

  const handleCreateVariable = async () => {
    console.log('handleCreateVariable called with:', { variableName, variableType, variableDefaultValue });
    if (!variableName.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      let defaultValue: string | number | boolean | undefined;
      if (variableDefaultValue.trim()) {
        switch (variableType) {
          case 'number':
            defaultValue = parseFloat(variableDefaultValue);
            if (isNaN(defaultValue)) {
              setError('Invalid number value');
              return;
            }
            break;
          case 'boolean':
            defaultValue = variableDefaultValue.toLowerCase() === 'true';
            break;
          default:
            defaultValue = variableDefaultValue;
        }
      }

      const data: CreateVariableDto = {
        variableName: variableName.trim(),
        variableType: variableType,
        defaultValue,
        description: variableDescription.trim() || undefined,
      };

      console.log('Creating variable with data:', data);
      const result = await variablesService.createVariable(storyId, data);
      console.log('Variable created successfully:', result);
      await loadVariables();
      resetForm();
    } catch (err) {
      setError('Failed to create variable');
      console.error('Error creating variable:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVariable = async () => {
    if (!editingVariable || !variableName.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      let defaultValue: string | number | boolean | undefined;
      if (variableDefaultValue.trim()) {
        switch (variableType) {
          case 'number':
            defaultValue = parseFloat(variableDefaultValue);
            break;
          case 'boolean':
            defaultValue = variableDefaultValue.toLowerCase() === 'true';
            break;
          default:
            defaultValue = variableDefaultValue;
        }
      }

      const data: UpdateVariableDto = {
        variableName: variableName.trim(),
        variableType: variableType,
        defaultValue,
        description: variableDescription.trim() || undefined,
      };

      await variablesService.updateVariable(storyId, editingVariable.id, data);
      await loadVariables();
      resetForm();
    } catch (err) {
      setError('Failed to update variable');
      console.error('Error updating variable:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVariable = async (variableId: string) => {
    if (!confirm('Are you sure you want to delete this variable?')) return;

    try {
      setIsLoading(true);
      setError(null);
      await variablesService.deleteVariable(storyId, variableId);
      await loadVariables();
    } catch (err) {
      setError('Failed to delete variable');
      console.error('Error deleting variable:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (variable: StoryVariable) => {
    setEditingId(variable.id);
    setVariableName(variable.variableName);
    setVariableType(variable.variableType as 'string' | 'boolean' | 'integer');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-96 max-h-96 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Variables</h3>
        <Button onClick={onToggle} size="sm" variant="outline">
          Hide
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {isLoading && variables.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Loading variables...</div>
        ) : variables.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No variables yet</div>
        ) : (
          <div className="space-y-2 mb-4">
            {variables.map((variable) => (
              <div key={variable.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{variable.variableName}</div>
                  <div className="text-xs text-gray-600">
                    {variable.variableType}
                    {variable.defaultValue !== undefined && ` = ${variable.defaultValue}`}
                  </div>
                  {variable.description && (
                    <div className="text-xs text-gray-500 truncate">{variable.description}</div>
                  )}
                </div>
                <div className="flex space-x-1 ml-2">
                  <Button
                    onClick={() => startEditing(variable)}
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteVariable(variable.id)}
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCreateForm && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">
              {editingVariable ? 'Edit Variable' : 'Create Variable'}
            </h4>
            <div className="space-y-3">
              <Input
                data-testid="variable-name-input"
                placeholder="Variable name"
                value={variableName}
                onChange={(e) => setVariableName(e.target.value)}
                disabled={isLoading}
              />

              <select
                data-testid="variable-type-select"
                value={variableType}
                onChange={(e) => setVariableType(e.target.value as 'string' | 'integer' | 'boolean')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                disabled={isLoading}
              >
                <option value="string">String</option>
                <option value="integer">Integer</option>
                <option value="boolean">Boolean</option>
              </select>

              <Input
                data-testid="variable-default-value-input"
                placeholder="Default value (optional)"
                value={variableDefaultValue}
                onChange={(e) => setVariableDefaultValue(e.target.value)}
                disabled={isLoading}
              />

              <Input
                data-testid="variable-description-input"
                placeholder="Description (optional)"
                value={variableDescription}
                onChange={(e) => setVariableDescription(e.target.value)}
                disabled={isLoading}
              />

              <div className="flex space-x-2">
                <Button
                  data-testid="create-variable-btn"
                  onClick={editingVariable ? handleUpdateVariable : handleCreateVariable}
                  size="sm"
                  disabled={isLoading || !variableName.trim()}
                  className="flex-1"
                >
                  {isLoading ? 'Saving...' : (editingVariable ? 'Update' : 'Create')}
                </Button>
                <Button
                  data-testid="cancel-variable-btn"
                  onClick={resetForm}
                  size="sm"
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!showCreateForm && (
        <div className="border-t pt-4">
          <Button
            data-testid="add-variable-btn"
            onClick={() => setShowCreateForm(true)}
            size="sm"
            className="w-full"
            disabled={isLoading}
          >
            Add Variable
          </Button>
        </div>
      )}
    </div>
  );
};