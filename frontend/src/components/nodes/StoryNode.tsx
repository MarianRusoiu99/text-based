import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface StoryNodeData {
  title: string;
  content: string;
  nodeType: 'story' | 'choice' | 'condition' | 'ending';
  choiceCount?: number;
}

const StoryNode: React.FC<NodeProps<StoryNodeData>> = ({ data, selected }) => {
  const { title, content, nodeType, choiceCount = 2 } = data;
  
  // Create multiple handles on the right side for choice connections
  const choiceHandles = Array.from({ length: choiceCount }, (_, index) => (
    <Handle
      key={`choice-${index}`}
      type="source"
      position={Position.Right}
      id={`choice-${index}`}
      style={{
        top: `${20 + (index * 60 / choiceCount) + 20}%`,
        background: '#10b981',
        width: 12,
        height: 12,
        border: '2px solid white',
      }}
      title={`Choice ${index + 1}`}
    />
  ));

  const getNodeStyle = () => {
    const baseStyle = {
      background: 'white',
      border: '2px solid',
      borderRadius: '8px',
      padding: '16px',
      minWidth: '200px',
      maxWidth: '300px',
      boxShadow: selected ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
    };

    switch (nodeType) {
      case 'story':
        return {
          ...baseStyle,
          borderColor: '#3b82f6',
          background: 'linear-gradient(135deg, #dbeafe, #f8fafc)',
        };
      case 'choice':
        return {
          ...baseStyle,
          borderColor: '#10b981',
          background: 'linear-gradient(135deg, #dcfce7, #f8fafc)',
        };
      case 'condition':
        return {
          ...baseStyle,
          borderColor: '#f59e0b',
          background: 'linear-gradient(135deg, #fef3c7, #f8fafc)',
        };
      case 'ending':
        return {
          ...baseStyle,
          borderColor: '#ef4444',
          background: 'linear-gradient(135deg, #fee2e2, #f8fafc)',
        };
      default:
        return baseStyle;
    }
  };

  const getTypeLabel = () => {
    switch (nodeType) {
      case 'story': return '📖 Story';
      case 'choice': return '🔀 Choice';
      case 'condition': return '❓ Condition';
      case 'ending': return '🏁 Ending';
      default: return '📄 Node';
    }
  };

  return (
    <div style={getNodeStyle()}>
      {/* Input handle on the left side for incoming connections */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#6b7280',
          width: 12,
          height: 12,
          border: '2px solid white',
        }}
        title="Input connection"
      />

      {/* Node content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">
            {getTypeLabel()}
          </span>
          {nodeType === 'story' && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {choiceCount} choices
            </span>
          )}
        </div>
        
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
          {title || 'Untitled Node'}
        </h3>
        
        {content && (
          <p className="text-xs text-gray-600 line-clamp-3">
            {content.length > 100 ? `${content.substring(0, 100)}...` : content}
          </p>
        )}
      </div>

      {/* Multiple choice handles for story nodes */}
      {nodeType === 'story' && choiceHandles}
      
      {/* Single output handle for non-story nodes */}
      {nodeType !== 'story' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: '#10b981',
            width: 12,
            height: 12,
            border: '2px solid white',
          }}
          title="Output connection"
        />
      )}
    </div>
  );
};

export default StoryNode;