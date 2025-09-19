import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge as RFEdge,
  type Node as RFNode,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodesService } from '../services/nodesService';
import { choicesService } from '../services/choicesService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { VariablesPanel } from './VariablesPanel';
import { ItemsPanel } from './ItemsPanel';
import { ConditionsBuilder, type Condition } from './ConditionsBuilder';
import { EffectsBuilder, type Effect } from './EffectsBuilder';
import type { StoryVariable } from '../services/variablesService';
import type { StoryItem } from '../services/itemsService';


interface StoryFlowProps {
  storyId: string;
}

const StoryFlow: React.FC<StoryFlowProps> = ({ storyId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RFEdge>([]);
  const [selectedNode, setSelectedNode] = useState<RFNode | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<{ id: string } | null>(null);
  const [nodeType, setNodeType] = useState<'story' | 'choice' | 'condition' | 'ending'>('story');
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeContent, setNodeContent] = useState('');
  const [nodeCharacter, setNodeCharacter] = useState('');
  const [nodeBackground, setNodeBackground] = useState('');
  const [choiceText, setChoiceText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVariablesPanel, setShowVariablesPanel] = useState(false);
  const [showItemsPanel, setShowItemsPanel] = useState(false);
  const [choiceConditions, setChoiceConditions] = useState<Condition | null>(null);
  const [choiceEffects, setChoiceEffects] = useState<Effect[]>([]);
  const [availableVariables, setAvailableVariables] = useState<StoryVariable[]>([]);
  const [availableItems, setAvailableItems] = useState<StoryItem[]>([]);

  const handleVariablesUpdated = useCallback((variables: StoryVariable[]) => {
    setAvailableVariables(variables);
  }, []);

  const handleItemsUpdated = useCallback((items: StoryItem[]) => {
    setAvailableItems(items);
  }, []);

  // Transform data for ConditionsBuilder and EffectsBuilder components
  const transformedVariables = availableVariables.map(variable => ({
    id: variable.id,
    name: variable.variableName,
    type: variable.variableType
  }));

  const transformedItems = availableItems.map(item => ({
    id: item.id,
    name: item.itemName
  }));

  useEffect(() => {
    console.log('StoryFlow useEffect triggered with storyId:', storyId);
    if (!storyId) {
      console.log('No storyId provided');
      setError('No story ID provided');
      setIsLoading(false);
      return;
    }

    // Temporarily skip auth check for testing
    // const { isAuthenticated } = useAuthStore.getState();
    // if (!isAuthenticated) {
    //   console.log('User not authenticated');
    //   setError('You must be logged in to edit stories');
    //   setIsLoading(false);
    //   return;
    // }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Loading data for storyId:', storyId);

        const [nodesRes, choicesRes] = await Promise.all([
          nodesService.getNodes(storyId),
          choicesService.getChoices(storyId),
        ]);

        console.log('Nodes response:', nodesRes);
        console.log('Choices response:', choicesRes);

        if (nodesRes.success) {
          const rfNodes: RFNode[] = nodesRes.data.map((node) => {
            console.log('Processing node:', node);
            console.log('Node position:', node.position);
            // Ensure position is in correct format
            let position = { x: 0, y: 0 }; // default
            if (node.position && typeof node.position === 'object') {
              const pos = node.position as { x?: number; y?: number };
              if (typeof pos.x === 'number' && typeof pos.y === 'number') {
                position = { x: pos.x, y: pos.y };
              }
            }
            const rfNode: RFNode = {
              id: node.id,
              type: 'default',
              data: {
                label: node.title,
                type: 'story', // Default to story type for now
                content: typeof node.content === 'object' && node.content ? node.content.text : node.content,
                character: typeof node.content === 'object' && node.content ? node.content.character : undefined,
                background: typeof node.content === 'object' && node.content ? node.content.background : undefined
              },
              position,
            };
            console.log('Created RF node:', rfNode);
            return rfNode;
          });

         
          setNodes(rfNodes);
        } else {
          console.log('API call failed:', nodesRes);
          setError('Failed to load nodes from API');
        }

        if (choicesRes.success && choicesRes.data.length > 0) {
          // TODO: Implement proper choice mapping when backend is ready
          // For now, skip processing choices since the structure is not finalized
          console.log('Choices loaded:', choicesRes.data.length);
          // const rfEdges: RFEdge[] = choicesRes.data.map((choice) => ({
          //   id: choice.id,
          //   source: choice.fromNodeId,
          //   target: choice.toNodeId,
          //   label: choice.choiceText,
          // }));
          // setEdges(rfEdges);
        }
      } catch (error) {
        console.error('Failed to load story data:', error);
        setError('Failed to load story data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storyId, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback(async (_, node) => {
    setSelectedNode(node);
    try {
      const result = await nodesService.getNode(node.id);
      if (result.success) {
        const nodeData = result.data;
        setNodeTitle(nodeData.title);
        if (typeof nodeData.content === 'object' && nodeData.content) {
          setNodeContent(nodeData.content.text || '');
          setNodeCharacter(nodeData.content.character || '');
          setNodeBackground(nodeData.content.background || '');
        } else {
          setNodeContent(typeof nodeData.content === 'string' ? nodeData.content : '');
          setNodeCharacter('');
          setNodeBackground('');
        }
      }
    } catch (error) {
      console.error('Failed to load node data:', error);
    }
  }, []);

  const onConnect = useCallback(
    async (params: Connection) => {
      try {
        const result = await choicesService.createChoice({
          fromNodeId: params.source!,
          toNodeId: params.target!,
          choiceText: 'New Choice',
        });

        if (result.success) {
          setEdges((eds) => addEdge({ ...params, id: result.data.id, label: 'New Choice' }, eds));
        }
      } catch (error) {
        console.error('Failed to create choice:', error);
      }
    },
    [setEdges],
  );

  const handleAddNode = useCallback(async () => {
    try {
      console.log('Adding new node...');
      setIsAddingNode(true);
      setError(null);

      const result = await nodesService.createNode({
        storyId,
        title: 'New Node',
        content: { text: 'New node content' },
        position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      });

      console.log('Create node result:', result);

      if (result.success) {
        console.log('Node creation successful:', result.data);
        // Ensure position is in correct format
        let position = { x: 100, y: 100 }; // default
        if (result.data.position && typeof result.data.position === 'object') {
          const pos = result.data.position as { x?: number; y?: number };
          if (typeof pos.x === 'number' && typeof pos.y === 'number') {
            position = { x: pos.x, y: pos.y };
          }
        }
        const newNode: RFNode = {
          id: result.data.id,
          type: 'default',
          data: {
            label: `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`,
            type: nodeType
          },
          position,
        };
        console.log('Created new RF node:', newNode);
        setNodes((nds) => [...nds, newNode]);
      } else {
        console.log('Failed to create node, setting error');
        setError('Failed to create node');
        console.error('Failed to create node:', result);
      }
    } catch (error) {
      console.error('Failed to create node:', error);
      setError('Failed to create node');
    } finally {
      setIsAddingNode(false);
    }
  }, [storyId, setNodes, nodeType]);

  const onEdgeClick = useCallback(async (_event: React.MouseEvent, edge: RFEdge) => {
    // Deselect node if one is selected
    setSelectedNode(null);
    
    // Load choice data
    try {
      // For now, we'll assume the edge id is the choice id
      // In a real implementation, you might need to store choice id in edge data
      const choiceId = edge.id;
      
      const result = await choicesService.getChoice(choiceId);
      
      if (result.success) {
        const choice = result.data;
        setSelectedChoice({ id: choiceId });
        setChoiceText(choice.choiceText || '');
        setChoiceConditions(choice.conditions || null);
        setChoiceEffects(choice.effects || []);
      } else {
        // If choice doesn't exist yet, create a new one
        setSelectedChoice({ id: choiceId });
        setChoiceText(typeof edge.label === 'string' ? edge.label : 'New Choice');
        setChoiceConditions(null);
        setChoiceEffects([]);
      }
    } catch (error) {
      console.error('Failed to load choice data:', error);
      // Fallback to placeholder data
      setSelectedChoice({ id: edge.id });
      setChoiceText(typeof edge.label === 'string' ? edge.label : 'New Choice');
      setChoiceConditions(null);
      setChoiceEffects([]);
    }
  }, []);

  const handleSaveChoice = useCallback(async () => {
    if (!selectedChoice) return;

    try {
      const result = await choicesService.updateChoice(selectedChoice.id, {
        choiceText,
        conditions: choiceConditions || undefined,
        effects: choiceEffects,
      });

      if (result.success) {
        // Update the edge label
        setEdges((eds) =>
          eds.map((edge) =>
            edge.id === selectedChoice.id
              ? { ...edge, label: choiceText }
              : edge
          )
        );
      }
    } catch (error) {
      console.error('Failed to save choice:', error);
    }
  }, [selectedChoice, choiceText, choiceConditions, choiceEffects, setEdges]);

  const handleSaveNode = useCallback(async () => {
    if (!selectedNode) return;

    try {
      await nodesService.updateNode(selectedNode.id, {
        title: nodeTitle,
        content: {
          character: nodeCharacter || undefined,
          background: nodeBackground || undefined,
          text: nodeContent
        },
        position: selectedNode.position,
      });

      // Update the node in the flow
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, label: nodeTitle } }
            : node
        )
      );
    } catch (error) {
      console.error('Failed to save node:', error);
    }
  }, [selectedNode, nodeTitle, nodeContent, nodeCharacter, nodeBackground, setNodes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading story...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  const nodeTypes = {};

  return (
    <div className="flex flex-1 relative">
      <div className="flex-1 overflow-hidden" style={{ height: 'calc(100vh - 202px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="w-80 p-4 border-l border-gray-300 bg-white">
          <h3 className="text-lg font-semibold mb-4">Edit Node</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Node Type
              </label>
              <select
                value={(selectedNode.data as Record<string, unknown>)?.type as string || 'story'}
                onChange={(e) => {
                  // Update node type in the data
                  setNodes((nds) =>
                    nds.map((node) =>
                      node.id === selectedNode.id
                        ? { ...node, data: { ...node.data, type: e.target.value } }
                        : node
                    )
                  );
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="story">Story Node</option>
                <option value="choice">Choice Node</option>
                <option value="condition">Condition Node</option>
                <option value="ending">Ending Node</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                value={nodeTitle}
                onChange={(e) => setNodeTitle(e.target.value)}
                placeholder="Node title"
              />
            </div>

            {(((selectedNode.data as Record<string, unknown>)?.type === 'story' || !(selectedNode.data as Record<string, unknown>)?.type)) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Character (optional)
                  </label>
                  <Input
                    value={nodeCharacter}
                    onChange={(e) => setNodeCharacter(e.target.value)}
                    placeholder="Character name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background (optional)
                  </label>
                  <Input
                    value={nodeBackground}
                    onChange={(e) => setNodeBackground(e.target.value)}
                    placeholder="Background description or URL"
                  />
                </div>
              </>
            )}

            {(selectedNode.data as Record<string, unknown>)?.type === 'choice' && (
              <div className="space-y-4 border-t pt-4">
                <ConditionsBuilder
                  conditions={choiceConditions}
                  onChange={setChoiceConditions}
                  variables={transformedVariables}
                  items={transformedItems}
                />
                <EffectsBuilder
                  effects={choiceEffects}
                  onChange={setChoiceEffects}
                  variables={transformedVariables}
                  items={transformedItems}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <div className="mb-2 flex flex-wrap gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const textarea = document.querySelector('textarea[placeholder="Node content"]') as HTMLTextAreaElement;
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
                    const textarea = document.querySelector('textarea[placeholder="Node content"]') as HTMLTextAreaElement;
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
                    setNodeContent(prev => prev + `\n\n"${characterName}: "`);
                  }}
                  className="text-xs px-2 py-1 h-6"
                >
                  💬
                </Button>
              </div>
              <textarea
                value={nodeContent}
                onChange={(e) => setNodeContent(e.target.value)}
                placeholder="Node content - use **bold** and *italic* formatting"
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                rows={8}
              />
              <div className="text-xs text-gray-500 mt-1">
                Use **text** for bold, *text* for italic, or 💬 for dialogue
              </div>
            </div>

            <Button onClick={handleSaveNode} className="w-full">
              Save Node
            </Button>
          </div>
        </div>
      )}

      {selectedChoice && (
        <div className="w-80 p-4 border-l border-gray-300 bg-white">
          <h3 className="text-lg font-semibold mb-4">Edit Choice</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choice Text
              </label>
              <Input
                value={choiceText}
                onChange={(e) => setChoiceText(e.target.value)}
                placeholder="Enter choice text..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conditions
              </label>
              <ConditionsBuilder
                conditions={choiceConditions}
                onChange={setChoiceConditions}
                variables={transformedVariables}
                items={transformedItems}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effects
              </label>
              <EffectsBuilder
                effects={choiceEffects}
                onChange={setChoiceEffects}
                variables={transformedVariables}
                items={transformedItems}
              />
            </div>

            <Button onClick={handleSaveChoice} className="w-full">
              Save Choice
            </Button>
          </div>
        </div>
      )}

      {/* Floating Add Node Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Node Type
            </label>
            <select
              value={nodeType}
              onChange={(e) => setNodeType(e.target.value as 'story' | 'choice' | 'condition' | 'ending')}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="story">Story Node</option>
              <option value="choice">Choice Node</option>
              <option value="condition">Condition Node</option>
              <option value="ending">Ending Node</option>
            </select>
          </div>
          <Button onClick={handleAddNode} disabled={isAddingNode} size="sm" className="w-full">
            {isAddingNode ? 'Adding...' : 'Add Node'}
          </Button>
        </div>
      </div>

      {/* RPG Mechanics Toggle Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex flex-col gap-2">
            <Button 
              data-testid="variables-toggle-btn"
              onClick={() => setShowVariablesPanel(!showVariablesPanel)}
              variant={showVariablesPanel ? "primary" : "outline"}
              size="sm"
            >
              Variables
            </Button>
            <Button 
              data-testid="items-toggle-btn"
              onClick={() => setShowItemsPanel(!showItemsPanel)}
              variant={showItemsPanel ? "primary" : "outline"}
              size="sm"
            >
              Items
            </Button>
            <Button 
              data-testid="conditions-toggle-btn"
              onClick={() => {/* TODO: Add conditions panel */}}
              variant="outline"
              size="sm"
            >
              Conditions
            </Button>
            <Button 
              data-testid="effects-toggle-btn"
              onClick={() => {/* TODO: Add effects panel */}}
              variant="outline"
              size="sm"
            >
              Effects
            </Button>
          </div>
        </div>
      </div>

      {/* RPG Mechanics Panels */}
      <VariablesPanel
        storyId={storyId}
        isOpen={showVariablesPanel}
        onToggle={() => setShowVariablesPanel(!showVariablesPanel)}
        onVariablesChange={handleVariablesUpdated}
      />
      <ItemsPanel
        storyId={storyId}
        isOpen={showItemsPanel}
        onToggle={() => setShowItemsPanel(!showItemsPanel)}
        onItemsChange={handleItemsUpdated}
      />

      {error && (
        <div className="absolute top-4 right-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default StoryFlow;
