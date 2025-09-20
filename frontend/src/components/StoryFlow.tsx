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
import { VariablesPanel } from './VariablesPanel';
import { ItemsPanel } from './ItemsPanel';
import { NodePreviewModal } from './NodePreviewModal';
import { StoryNode } from './nodes';
import type { StoryVariable } from '../services/variablesService';
import type { StoryItem } from '../services/itemsService';

interface StoryFlowProps {
  storyId: string;
}

const StoryFlow: React.FC<StoryFlowProps> = ({ storyId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RFEdge>([]);
  const [selectedNode, setSelectedNode] = useState<RFNode | null>(null);
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [nodeType, setNodeType] = useState<'story' | 'choice' | 'condition' | 'ending'>('story');
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVariablesPanel, setShowVariablesPanel] = useState(false);
  const [showItemsPanel, setShowItemsPanel] = useState(false);
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
              type: 'storyNode',
              data: {
                title: node.title,
                content: typeof node.content === 'object' && node.content ? node.content.text || '' : (node.content || ''),
                nodeType: (node.nodeType as 'story' | 'choice' | 'condition' | 'ending') || 'story',
                choiceCount: node.nodeType === 'story' ? 3 : 1,
              },
              position,
            };
            console.log('Created RF node:', rfNode);
            return rfNode;
          });
          console.log('Setting nodes:', rfNodes);
          setNodes(rfNodes);
        } else {
          console.error('Failed to load nodes:', nodesRes);
          setError('Failed to load story nodes');
        }

        if (choicesRes.success) {
          const rfEdges: RFEdge[] = choicesRes.data.map((choice) => ({
            id: choice.id,
            source: choice.fromNodeId,
            target: choice.toNodeId,
            label: choice.text || choice.choiceText || 'Choice',
          }));
          console.log('Setting edges:', rfEdges);
          setEdges(rfEdges);
        } else {
          console.error('Failed to load choices:', choicesRes);
          // Don't set error for choices since they might not exist yet
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load story data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storyId, setNodes, setEdges]);

  const onConnect = useCallback(
    async (params: Connection) => {
      try {
        const result = await choicesService.createChoice(params.source!, {
          toNodeId: params.target!,
          text: 'New Choice',
        });

        if (result.success && result.data) {
          setEdges((eds) => addEdge({ ...params, id: result.data!.id, label: 'New Choice' }, eds));
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
          type: 'storyNode',
          data: {
            title: result.data.title,
            content: typeof result.data.content === 'string' 
              ? result.data.content 
              : result.data.content?.text || 'New node content',
            nodeType: nodeType,
            choiceCount: nodeType === 'story' ? 3 : 1, // Story nodes get 3 choice handles, others get 1
          },
          position,
        };
        console.log('Adding node to state:', newNode);
        setNodes((nds) => [...nds, newNode]);
      } else {
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

  const onNodeClick: NodeMouseHandler = useCallback(async (_, node) => {
    setSelectedNode(node);
    setIsNodeModalOpen(true);
  }, []);

  const handleNodeSave = useCallback(async (node: RFNode, updatedData: any) => {
    try {
      await nodesService.updateNode(node.id, updatedData);

      // Update the node in the flow
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { 
                ...n, 
                data: { 
                  ...n.data, 
                  label: updatedData.title,
                  ...updatedData 
                } 
              }
            : n
        )
      );
    } catch (error) {
      console.error('Failed to save node:', error);
    }
  }, [setNodes]);

  const handleNodeDelete = useCallback(async (nodeId: string) => {
    try {
      await nodesService.deleteNode(nodeId);
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    } catch (error) {
      console.error('Failed to delete node:', error);
    }
  }, [setNodes, setEdges]);

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

  const nodeTypes = {
    storyNode: StoryNode,
  };

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
          <Button onClick={handleAddNode} disabled={isAddingNode} size="sm" className="w-full" data-testid="add-node-btn">
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

      {/* Node Preview Modal */}
      <NodePreviewModal
        node={selectedNode}
        isOpen={isNodeModalOpen}
        onClose={() => {
          setIsNodeModalOpen(false);
          setSelectedNode(null);
        }}
        onSave={handleNodeSave}
        onDelete={handleNodeDelete}
        variables={transformedVariables}
        items={transformedItems}
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