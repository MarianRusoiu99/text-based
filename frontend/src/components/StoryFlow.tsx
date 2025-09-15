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
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuthStore } from '../stores/authStore';

interface StoryFlowProps {
  storyId: string;
}

const StoryFlow: React.FC<StoryFlowProps> = ({ storyId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RFEdge>([]);
  const [selectedNode, setSelectedNode] = useState<RFNode | null>(null);
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeContent, setNodeContent] = useState('');
  const [nodeCharacter, setNodeCharacter] = useState('');
  const [nodeBackground, setNodeBackground] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);

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
              data: { label: node.title },
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

        if (choicesRes.success) {
          const rfEdges: RFEdge[] = choicesRes.data.map((choice) => ({
            id: choice.id,
            source: choice.fromNodeId,
            target: choice.toNodeId,
            label: choice.choiceText,
          }));
          setEdges(rfEdges);
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
          data: { label: 'New Node' },
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
  }, [storyId, setNodes]);

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
          nodeTypes={{}}
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
                Title
              </label>
              <Input
                value={nodeTitle}
                onChange={(e) => setNodeTitle(e.target.value)}
                placeholder="Node title"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={nodeContent}
                onChange={(e) => setNodeContent(e.target.value)}
                placeholder="Node content"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={6}
              />
            </div>
            <Button onClick={handleSaveNode} className="w-full">
              Save Node
            </Button>
          </div>
        </div>
      )}

      {/* Floating Add Node Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button onClick={handleAddNode} disabled={isAddingNode} className="shadow-lg">
          {isAddingNode ? 'Adding...' : 'Add Node'}
        </Button>
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
