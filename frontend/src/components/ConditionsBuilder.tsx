import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface Condition {
  type: 'variable' | 'item' | 'and' | 'or' | 'not';
  variableName?: string;
  operator?: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value?: string | number | boolean;
  itemId?: string;
  conditions?: Condition[];
}

interface ConditionsBuilderProps {
  conditions: Condition | null;
  onChange: (conditions: Condition | null) => void;
  variables: Array<{ id: string; name: string; type: string }>;
  items: Array<{ id: string; name: string }>;
}

export const ConditionsBuilder: React.FC<ConditionsBuilderProps> = ({
  conditions,
  onChange,
  variables,
  items,
}) => {
  const [showBuilder, setShowBuilder] = useState(false);

  const addCondition = (type: Condition['type']) => {
    const newCondition: Condition = { type };

    if (type === 'variable') {
      newCondition.variableName = variables[0]?.name || '';
      newCondition.operator = 'equals';
      newCondition.value = '';
    } else if (type === 'item') {
      newCondition.itemId = items[0]?.id || '';
    } else if (type === 'and' || type === 'or') {
      newCondition.conditions = [];
    }

    onChange(newCondition);
  };

  const updateCondition = (path: number[], updates: Partial<Condition>) => {
    const updateNestedCondition = (cond: Condition | null, pathIndex: number): Condition | null => {
      if (!cond || pathIndex >= path.length) {
        return { ...cond, ...updates } as Condition;
      }

      if (cond.conditions) {
        const newConditions = [...cond.conditions];
        newConditions[path[pathIndex]] = updateNestedCondition(newConditions[path[pathIndex]], pathIndex + 1) || newConditions[path[pathIndex]];
        return { ...cond, conditions: newConditions };
      }

      return cond;
    };

    onChange(updateNestedCondition(conditions, 0));
  };

  const addSubCondition = (path: number[], type: Condition['type']) => {
    const addToNestedCondition = (cond: Condition | null, pathIndex: number): Condition | null => {
      if (!cond) return null;

      if (pathIndex >= path.length) {
        if (cond.conditions) {
          const newSubCondition: Condition = { type };
          if (type === 'variable') {
            newSubCondition.variableName = variables[0]?.name || '';
            newSubCondition.operator = 'equals';
            newSubCondition.value = '';
          } else if (type === 'item') {
            newSubCondition.itemId = items[0]?.id || '';
          }
          return { ...cond, conditions: [...cond.conditions, newSubCondition] };
        }
        return cond;
      }

      if (cond.conditions) {
        const newConditions = [...cond.conditions];
        newConditions[path[pathIndex]] = addToNestedCondition(newConditions[path[pathIndex]], pathIndex + 1) || newConditions[path[pathIndex]];
        return { ...cond, conditions: newConditions };
      }

      return cond;
    };

    onChange(addToNestedCondition(conditions, 0));
  };

  const removeCondition = (path: number[]) => {
    if (path.length === 0) {
      onChange(null);
      return;
    }

    const removeFromNestedCondition = (cond: Condition | null, pathIndex: number): Condition | null => {
      if (!cond) return null;

      if (pathIndex === path.length - 1) {
        if (cond.conditions) {
          const newConditions = cond.conditions.filter((_, index) => index !== path[pathIndex]);
          return { ...cond, conditions: newConditions };
        }
        return null;
      }

      if (cond.conditions) {
        const newConditions = [...cond.conditions];
        newConditions[path[pathIndex]] = removeFromNestedCondition(newConditions[path[pathIndex]], pathIndex + 1) || newConditions[path[pathIndex]];
        return { ...cond, conditions: newConditions };
      }

      return cond;
    };

    onChange(removeFromNestedCondition(conditions, 0));
  };

  const renderCondition = (condition: Condition, path: number[] = []): React.ReactNode => {
    const pathKey = path.join('-');

    return (
      <div key={pathKey} className="border border-gray-200 rounded p-3 mb-2 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <select
            value={condition.type}
            onChange={(e) => updateCondition(path, { type: e.target.value as Condition['type'] })}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="variable">Variable</option>
            <option value="item">Item</option>
            <option value="and">AND</option>
            <option value="or">OR</option>
            <option value="not">NOT</option>
          </select>
          <Button
            onClick={() => removeCondition(path)}
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </Button>
        </div>

        {condition.type === 'variable' && (
          <div className="space-y-2">
            <select
              value={condition.variableName || ''}
              onChange={(e) => updateCondition(path, { variableName: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="">Select variable</option>
              {variables.map((variable) => (
                <option key={variable.id} value={variable.name}>
                  {variable.name} ({variable.type})
                </option>
              ))}
            </select>
            <select
              value={condition.operator || 'equals'}
              onChange={(e) => updateCondition(path, { operator: e.target.value as Condition['operator'] })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="equals">Equals</option>
              <option value="not_equals">Not Equals</option>
              <option value="greater_than">Greater Than</option>
              <option value="less_than">Less Than</option>
              <option value="contains">Contains</option>
            </select>
            <Input
              placeholder="Value"
              value={condition.value?.toString() || ''}
              onChange={(e) => {
                const variable = variables.find(v => v.name === condition.variableName);
                let parsedValue: string | number | boolean = e.target.value;

                if (variable?.type === 'number') {
                  const numValue = parseFloat(e.target.value);
                  parsedValue = isNaN(numValue) ? e.target.value : numValue;
                } else if (variable?.type === 'boolean') {
                  parsedValue = e.target.value.toLowerCase() === 'true';
                }

                updateCondition(path, { value: parsedValue });
              }}
              className="text-sm"
            />
          </div>
        )}

        {condition.type === 'item' && (
          <select
            value={condition.itemId || ''}
            onChange={(e) => updateCondition(path, { itemId: e.target.value })}
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

        {(condition.type === 'and' || condition.type === 'or') && (
          <div className="space-y-2">
            <div className="text-sm font-medium uppercase">{condition.type}</div>
            {condition.conditions?.map((subCondition, index) => (
              <div key={index}>
                {renderCondition(subCondition, [...path, index])}
              </div>
            ))}
            <Button
              onClick={() => addSubCondition(path, 'variable')}
              size="sm"
              variant="outline"
              className="w-full"
            >
              Add Condition
            </Button>
          </div>
        )}

        {condition.type === 'not' && (
          <div className="space-y-2">
            <div className="text-sm font-medium">NOT</div>
            {condition.conditions?.[0] && renderCondition(condition.conditions[0], [...path, 0])}
            {!condition.conditions?.[0] && (
              <Button
                onClick={() => addSubCondition(path, 'variable')}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Add Condition
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Conditions</label>
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
          {conditions ? (
            renderCondition(conditions)
          ) : (
            <div className="text-center py-4 text-gray-500">
              No conditions set
            </div>
          )}

          <div className="flex space-x-2 mt-3">
            <Button
              onClick={() => addCondition('variable')}
              size="sm"
              variant="outline"
            >
              Add Variable Condition
            </Button>
            <Button
              onClick={() => addCondition('item')}
              size="sm"
              variant="outline"
            >
              Add Item Condition
            </Button>
            <Button
              onClick={() => addCondition('and')}
              size="sm"
              variant="outline"
            >
              Add AND Group
            </Button>
            <Button
              onClick={() => addCondition('or')}
              size="sm"
              variant="outline"
            >
              Add OR Group
            </Button>
            <Button
              onClick={() => addCondition('not')}
              size="sm"
              variant="outline"
            >
              Add NOT
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};