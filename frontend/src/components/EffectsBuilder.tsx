import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface Effect {
  type: 'set_variable' | 'add_item' | 'remove_item' | 'modify_variable';
  variableName?: string;
  value?: string | number | boolean;
  itemId?: string;
  operator?: 'add' | 'subtract' | 'multiply' | 'divide';
  amount?: number;
}

interface EffectsBuilderProps {
  effects: Effect[];
  onChange: (effects: Effect[]) => void;
  variables: Array<{ id: string; name: string; type: string }>;
  items: Array<{ id: string; name: string }>;
}

export const EffectsBuilder: React.FC<EffectsBuilderProps> = ({
  effects,
  onChange,
  variables,
  items,
}) => {
  const [showBuilder, setShowBuilder] = useState(false);

  const addEffect = (type: Effect['type']) => {
    const newEffect: Effect = { type };

    if (type === 'set_variable') {
      newEffect.variableName = variables[0]?.name || '';
      newEffect.value = '';
    } else if (type === 'add_item' || type === 'remove_item') {
      newEffect.itemId = items[0]?.id || '';
    } else if (type === 'modify_variable') {
      newEffect.variableName = variables[0]?.name || '';
      newEffect.operator = 'add';
      newEffect.amount = 1;
    }

    onChange([...effects, newEffect]);
  };

  const updateEffect = (index: number, updates: Partial<Effect>) => {
    const newEffects = [...effects];
    newEffects[index] = { ...newEffects[index], ...updates };
    onChange(newEffects);
  };

  const removeEffect = (index: number) => {
    const newEffects = effects.filter((_, i) => i !== index);
    onChange(newEffects);
  };

  const renderEffect = (effect: Effect, index: number) => {
    return (
      <div key={index} className="border border-gray-200 rounded p-3 mb-2 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <select
            value={effect.type}
            onChange={(e) => updateEffect(index, { type: e.target.value as Effect['type'] })}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="set_variable">Set Variable</option>
            <option value="add_item">Add Item</option>
            <option value="remove_item">Remove Item</option>
            <option value="modify_variable">Modify Variable</option>
          </select>
          <Button
            onClick={() => removeEffect(index)}
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </Button>
        </div>

        {effect.type === 'set_variable' && (
          <div className="space-y-2">
            <select
              value={effect.variableName || ''}
              onChange={(e) => updateEffect(index, { variableName: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="">Select variable</option>
              {variables.map((variable) => (
                <option key={variable.id} value={variable.name}>
                  {variable.name} ({variable.type})
                </option>
              ))}
            </select>
            <Input
              placeholder="Value"
              value={effect.value?.toString() || ''}
              onChange={(e) => {
                const variable = variables.find(v => v.name === effect.variableName);
                let parsedValue: string | number | boolean = e.target.value;

                if (variable?.type === 'number') {
                  const numValue = parseFloat(e.target.value);
                  parsedValue = isNaN(numValue) ? e.target.value : numValue;
                } else if (variable?.type === 'boolean') {
                  parsedValue = e.target.value.toLowerCase() === 'true';
                }

                updateEffect(index, { value: parsedValue });
              }}
              className="text-sm"
            />
          </div>
        )}

        {(effect.type === 'add_item' || effect.type === 'remove_item') && (
          <select
            value={effect.itemId || ''}
            onChange={(e) => updateEffect(index, { itemId: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="">Select item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        )}

        {effect.type === 'modify_variable' && (
          <div className="space-y-2">
            <select
              value={effect.variableName || ''}
              onChange={(e) => updateEffect(index, { variableName: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="">Select variable</option>
              {variables.filter(v => v.type === 'number').map((variable) => (
                <option key={variable.id} value={variable.name}>
                  {variable.name}
                </option>
              ))}
            </select>
            <select
              value={effect.operator || 'add'}
              onChange={(e) => updateEffect(index, { operator: e.target.value as Effect['operator'] })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
              <option value="multiply">Multiply</option>
              <option value="divide">Divide</option>
            </select>
            <Input
              type="number"
              placeholder="Amount"
              value={effect.amount || ''}
              onChange={(e) => updateEffect(index, { amount: parseFloat(e.target.value) || 0 })}
              className="text-sm"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Effects</label>
        <Button
          onClick={() => setShowBuilder(!showBuilder)}
          size="sm"
          variant="outline"
        >
          {showBuilder ? 'Hide' : 'Edit'}
        </Button>
      </div>

      {showBuilder && (
        <div className="border border-gray-200 rounded p-3 bg-white">
          {effects.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No effects set
            </div>
          ) : (
            effects.map((effect, index) => renderEffect(effect, index))
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              onClick={() => addEffect('set_variable')}
              size="sm"
              variant="outline"
            >
              Set Variable
            </Button>
            <Button
              onClick={() => addEffect('add_item')}
              size="sm"
              variant="outline"
            >
              Add Item
            </Button>
            <Button
              onClick={() => addEffect('remove_item')}
              size="sm"
              variant="outline"
            >
              Remove Item
            </Button>
            <Button
              onClick={() => addEffect('modify_variable')}
              size="sm"
              variant="outline"
            >
              Modify Variable
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};