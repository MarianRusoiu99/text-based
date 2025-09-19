import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Save, Trash2, Plus } from 'lucide-react';
import { ConditionsBuilder, type Condition } from './ConditionsBuilder';
import { EffectsBuilder, type Effect } from './EffectsBuilder';
import { RpgCheckBuilder, type RpgCheck } from './RpgCheckBuilder';
import type { Node as RFNode } from '@xyflow/react';
import type { StoryVariable } from '../services/variablesService';
import type { StoryItem } from '../services/itemsService';

interface NodePreviewModalProps {
  node: RFNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (node: RFNode, updatedData: any) => void;
  onDelete?: (nodeId: string) => void;
  variables: Array<{ id: string; name: string; type: string }>;
  items: Array<{ id: string; name: string }>;
}

export const NodePreviewModal: React.FC<NodePreviewModalProps> = ({
  node,
  isOpen,
  onClose,
  onSave,
  onDelete,
  variables,
  items,
}) => {
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeContent, setNodeContent] = useState('');
  const [nodeCharacter, setNodeCharacter] = useState('');
  const [nodeBackground, setNodeBackground] = useState('');
  const [nodeType, setNodeType] = useState('story');
  const [choices, setChoices] = useState<Array<{
    id: string;
    text: string;
    conditions?: Condition;
    effects?: Effect[];
    toNodeId?: string;
  }>>([]);
  const [currentRpgCheck, setCurrentRpgCheck] = useState<RpgCheck | null>(null);
  const [showRpgCheckBuilder, setShowRpgCheckBuilder] = useState(false);

  useEffect(() => {
    if (node) {
      const data = node.data as any;
      setNodeTitle(data.label || '');
      setNodeContent(data.content?.text || '');
      setNodeCharacter(data.content?.character || '');
      setNodeBackground(data.content?.background || '');
      setNodeType(data.type || 'story');
      setChoices(data.choices || []);
      setCurrentRpgCheck(data.rpgCheck || null);
    }
  }, [node]);

  const handleSave = () => {
    if (!node) return;

    const updatedData = {
      title: nodeTitle,
      content: {
        text: nodeContent,
        character: nodeCharacter || undefined,
        background: nodeBackground || undefined,
      },
      type: nodeType,
      choices: choices,
      rpgCheck: currentRpgCheck,
    };

    onSave(node, updatedData);
    onClose();
  };

  const addChoice = () => {
    const newChoice = {
      id: `choice-${Date.now()}`,
      text: 'New Choice',
      conditions: undefined,
      effects: [],
      toNodeId: undefined,
    };
    setChoices([...choices, newChoice]);
  };

  const updateChoice = (index: number, updatedChoice: any) => {
    const newChoices = [...choices];
    newChoices[index] = { ...newChoices[index], ...updatedChoice };
    setChoices(newChoices);
  };

  const removeChoice = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  if (!node) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Edit Node: {nodeTitle || 'Untitled'}</span>
              <div className="flex gap-2">
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onDelete(node.id);
                      onClose();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 h-[80vh]">
            {/* Left Panel - Editor */}
            <div className="space-y-4 overflow-y-auto pr-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="node-type">Node Type</Label>
                  <select
                    id="node-type"
                    value={nodeType}
                    onChange={(e) => setNodeType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="story">Story Node</option>
                    <option value="choice">Choice Node</option>
                    <option value="condition">Condition Node</option>
                    <option value="ending">Ending Node</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="node-title">Title</Label>
                  <Input
                    id="node-title"
                    value={nodeTitle}
                    onChange={(e) => setNodeTitle(e.target.value)}
                    placeholder="Node title"
                  />
                </div>
              </div>

              {(nodeType === 'story' || nodeType === 'ending') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="node-character">Character (optional)</Label>
                    <Input
                      id="node-character"
                      value={nodeCharacter}
                      onChange={(e) => setNodeCharacter(e.target.value)}
                      placeholder="Character name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="node-background">Background (optional)</Label>
                    <Input
                      id="node-background"
                      value={nodeBackground}
                      onChange={(e) => setNodeBackground(e.target.value)}
                      placeholder="Background description"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="node-content">Content</Label>
                <div className="mb-2 flex flex-wrap gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const textarea = document.getElementById('node-content') as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = nodeContent.substring(start, end);
                        const newText = nodeContent.substring(0, start) + `**${selectedText}**` + nodeContent.substring(end);
                        setNodeContent(newText);
                      }
                    }}
                    className="text-xs px-2 py-1 h-6"
                  >
                    <strong>B</strong>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const textarea = document.getElementById('node-content') as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = nodeContent.substring(start, end);
                        const newText = nodeContent.substring(0, start) + `*${selectedText}*` + nodeContent.substring(end);
                        setNodeContent(newText);
                      }
                    }}
                    className="text-xs px-2 py-1 h-6"
                  >
                    <em>I</em>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setNodeContent(prev => prev + '\n\n---\n\n')}
                    className="text-xs px-2 py-1 h-6"
                  >
                    ―
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const characterName = nodeCharacter || 'Character';
                      setNodeContent(prev => prev + `\n\n"${characterName}": `);
                    }}
                    className="text-xs px-2 py-1 h-6"
                  >
                    💬
                  </Button>
                </div>
                <textarea
                  id="node-content"
                  value={nodeContent}
                  onChange={(e) => setNodeContent(e.target.value)}
                  placeholder="Node content - use **bold** and *italic* formatting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  rows={12}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Use **text** for bold, *text* for italic, or 💬 for dialogue
                </div>
              </div>

              {/* Choices Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label>Choices</Label>
                  <Button
                    onClick={addChoice}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Choice
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {choices.map((choice, index) => (
                    <div key={choice.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          value={choice.text}
                          onChange={(e) => updateChoice(index, { text: e.target.value })}
                          placeholder="Choice text"
                          className="flex-1"
                        />
                        <Button
                          onClick={() => removeChoice(index)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Conditions</Label>
                          <ConditionsBuilder
                            conditions={choice.conditions}
                            onChange={(conditions) => updateChoice(index, { conditions })}
                            variables={variables}
                            items={items}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Effects</Label>
                          <EffectsBuilder
                            effects={choice.effects || []}
                            onChange={(effects) => updateChoice(index, { effects })}
                            variables={variables}
                            items={items}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RPG Check Section */}
              <div className="border-t pt-4">
                <Label className="block mb-2">RPG Mechanics</Label>
                {currentRpgCheck ? (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-sm">
                      <strong>RPG Check:</strong> {currentRpgCheck.type} (Difficulty: {currentRpgCheck.difficulty})
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Success: {currentRpgCheck.successText.substring(0, 50)}...
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowRpgCheckBuilder(true)}
                      >
                        Edit RPG Check
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentRpgCheck(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowRpgCheckBuilder(true)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Add RPG Check
                  </Button>
                )}
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="border-l pl-6">
              <div className="sticky top-0 bg-white z-10 pb-4 border-b mb-4">
                <h3 className="text-lg font-semibold">Preview</h3>
              </div>
              
              <div className="space-y-4 overflow-y-auto">
                {/* Node Preview */}
                <div className="bg-gray-900 text-white p-6 rounded-lg min-h-48">
                  {nodeCharacter && (
                    <div className="text-sm text-gray-300 mb-2">{nodeCharacter}</div>
                  )}
                  {nodeBackground && (
                    <div className="text-xs text-gray-400 mb-3 italic">{nodeBackground}</div>
                  )}
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatText(nodeContent) }}
                  />
                </div>

                {/* Choices Preview */}
                {choices.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">Choices:</h4>
                    {choices.map((choice, index) => (
                      <div
                        key={choice.id}
                        className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="text-sm">{choice.text}</div>
                        {(choice.conditions || (choice.effects && choice.effects.length > 0)) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {choice.conditions && <span>• Has conditions</span>}
                            {choice.effects && choice.effects.length > 0 && <span>• Has effects</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* RPG Check Preview */}
                {currentRpgCheck && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                    <div className="text-sm font-medium text-blue-800">
                      RPG Check: {currentRpgCheck.type}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Difficulty: {currentRpgCheck.difficulty}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* RPG Check Builder Modal */}
      {showRpgCheckBuilder && (
        <RpgCheckBuilder
          isOpen={showRpgCheckBuilder}
          onClose={() => setShowRpgCheckBuilder(false)}
          onSave={(rpgCheck) => {
            setCurrentRpgCheck(rpgCheck);
            setShowRpgCheckBuilder(false);
          }}
          initialCheck={currentRpgCheck}
        />
      )}
    </>
  );
};