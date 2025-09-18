import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface CharacterStat {
  id: string;
  name: string;
  value: unknown;
  maxValue?: number;
  category?: string;
}

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  properties: Record<string, unknown>;
}

interface CharacterPanelProps {
  characterState?: {
    stats?: Record<string, unknown>;
    inventory?: InventoryItem[];
    achievements?: string[];
    flags?: Record<string, boolean>;
  };
  templateConfig?: {
    stats?: Array<{
      id: string;
      name: string;
      maxValue?: number;
      category?: string;
    }>;
  };
  onSaveGame?: () => void;
  onLoadGame?: () => void;
  canSave?: boolean;
}

export const CharacterPanel: React.FC<CharacterPanelProps> = ({
  characterState,
  templateConfig,
  onSaveGame,
  onLoadGame,
  canSave = true,
}) => {
  if (!characterState) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Character</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No RPG mechanics for this story</p>
        </CardContent>
      </Card>
    );
  }

  const stats: CharacterStat[] = [];
  if (characterState.stats && templateConfig?.stats) {
    templateConfig.stats.forEach(statDef => {
      if (characterState.stats) {
        const value = characterState.stats[statDef.id];
        if (value !== undefined) {
          stats.push({
            id: statDef.id,
            name: statDef.name,
            value,
            maxValue: statDef.maxValue,
            category: statDef.category,
          });
        }
      }
    });
  }

  const renderStatValue = (stat: CharacterStat) => {
    if (typeof stat.value === 'number' && stat.maxValue) {
      return (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{stat.value}</span>
            <span className="text-gray-500">/{stat.maxValue}</span>
          </div>
          <Progress value={(stat.value / stat.maxValue) * 100} className="h-2" />
        </div>
      );
    }
    return <span className="text-sm font-medium">{String(stat.value)}</span>;
  };

  return (
    <Card className="w-80 h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Character</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Section */}
        {stats.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2 text-gray-700">Stats</h4>
            <div className="space-y-2">
              {stats.map(stat => (
                <div key={stat.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stat.name}</span>
                  {renderStatValue(stat)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Section */}
        {characterState.inventory && characterState.inventory.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-sm mb-2 text-gray-700">Inventory</h4>
              <div className="space-y-2">
                {characterState.inventory.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      {item.description && (
                        <p className="text-xs text-gray-500">{item.description}</p>
                      )}
                    </div>
                    {item.quantity > 1 && (
                      <Badge variant="secondary" className="text-xs">
                        {item.quantity}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Flags Section */}
        {characterState.flags && Object.keys(characterState.flags).length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-sm mb-2 text-gray-700">Status</h4>
              <div className="flex flex-wrap gap-1">
                {Object.entries(characterState.flags)
                  .filter(([, flagValue]) => flagValue)
                  .map(([flagId]) => (
                    <Badge key={flagId} variant="outline" className="text-xs">
                      {flagId.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Badge>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* Achievements Section */}
        {characterState.achievements && characterState.achievements.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-sm mb-2 text-gray-700">
                Achievements ({characterState.achievements.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {characterState.achievements.slice(0, 5).map(achievementId => (
                  <Badge key={achievementId} className="text-xs">
                    🏆 {achievementId}
                  </Badge>
                ))}
                {characterState.achievements.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{characterState.achievements.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}

        {/* Save/Load Actions */}
        {(onSaveGame || onLoadGame) && (
          <>
            <Separator />
            <div className="space-y-2">
              {onSaveGame && canSave && (
                <Button onClick={onSaveGame} className="w-full" size="sm">
                  💾 Save Game
                </Button>
              )}
              {onLoadGame && (
                <Button onClick={onLoadGame} variant="outline" className="w-full" size="sm">
                  📁 Load Game
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};