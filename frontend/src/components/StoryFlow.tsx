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
import { useAuthStore } from '../stores/authStore';

interface StoryFlowProps {
  storyId: string;
}

const StoryFlow: React.FC<StoryFlowProps> = ({ storyId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RFEdge>([]);
  const [selectedNode, setSelectedNode] = useState<RFNode | null>(null);
  const [nodeType, setNodeType] = useState<'story' | 'choice' | 'condition' | 'ending'>('story');
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeContent, setNodeContent] = useState('');
  const [nodeCharacter, setNodeCharacter] = useState('');
  const [nodeBackground, setNodeBackground] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCharacterPanel, setShowCharacterPanel] = useState(false);
  const [characters, setCharacters] = useState<Array<{id: string, name: string, description?: string}>>([
    { id: '1', name: 'Protagonist', description: 'The main character' },
    { id: '2', name: 'Antagonist', description: 'The villain' },
  ]);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterDesc, setNewCharacterDesc] = useState('');

  useEffect(() => {
    console.log('StoryFlow useEffect triggered with storyId:', storyId);
    if (!storyId) {
      console.log('No storyId provided');
      setError('No story ID provided');
      setIsLoading(false);
      return;
    }

    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      console.log('User not authenticated');
      setError('You must be logged in to edit stories');
      setIsLoading(false);
      return;
    }

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

      {/* Character Management Panel */}
      <div className="absolute top-4 right-4 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Characters</h3>
          <Button
            onClick={() => setShowCharacterPanel(!showCharacterPanel)}
            size="sm"
            variant="outline"
          >
            {showCharacterPanel ? 'Hide' : 'Manage'}
          </Button>
        </div>

        {showCharacterPanel && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Existing Characters</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {characters.map((character) => (
                  <div key={character.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{character.name}</div>
                      {character.description && (
                        <div className="text-sm text-gray-600">{character.description}</div>
                      )}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      setNodeCharacter(character.name);
                    }}>
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Add New Character</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Character name"
                  value={newCharacterName}
                  onChange={(e) => setNewCharacterName(e.target.value)}
                />
                <Input
                  placeholder="Description (optional)"
                  value={newCharacterDesc}
                  onChange={(e) => setNewCharacterDesc(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (newCharacterName.trim()) {
                      const newChar = {
                        id: Date.now().toString(),
                        name: newCharacterName.trim(),
                        description: newCharacterDesc.trim() || undefined,
                      };
                      setCharacters([...characters, newChar]);
                      setNewCharacterName('');
                      setNewCharacterDesc('');
                    }
                  }}
                  size="sm"
                  className="w-full"
                  disabled={!newCharacterName.trim()}
                >
                  Add Character
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="absolute top-4 right-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default StoryFlow;
