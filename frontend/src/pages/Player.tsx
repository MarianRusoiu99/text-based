import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { nodesService } from '../services/nodesService';
import { choicesService } from '../services/choicesService';
import { Button } from '../components/ui/Button';

interface NodeContent {
  character?: string;
  background?: string;
  text?: string;
}

interface NodePosition {
  x: number;
  y: number;
}

interface ChoiceCondition {
  type: string;
  value: string | number | boolean;
}

interface ChoiceEffect {
  type: string;
  value: string | number | boolean;
}

interface Node {
  id: string;
  title: string;
  content: NodeContent | string;
  position: NodePosition;
}

interface Choice {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  choiceText: string;
  conditions?: ChoiceCondition[];
  effects?: ChoiceEffect[];
}

const Player: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const loadStory = async () => {
      if (!storyId) return;

      try {
        const [nodesRes, choicesRes] = await Promise.all([
          nodesService.getNodes(storyId),
          choicesService.getChoices(storyId),
        ]);

        if (nodesRes.success && choicesRes.success) {
          setNodes(nodesRes.data);
          setChoices(choicesRes.data);

          // Set starting node (first node or node with position closest to origin)
          const startNode = nodesRes.data.find(node =>
            node.position && node.position.x === 0 && node.position.y === 0
          ) || nodesRes.data[0];

          if (startNode) {
            setCurrentNode(startNode);
          }
        } else {
          setError('Failed to load story');
        }
      } catch {
        setError('Error loading story');
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [storyId]);

  useEffect(() => {
    if (currentNode) {
      const text = typeof currentNode.content === 'object' && currentNode.content?.text
        ? currentNode.content.text
        : typeof currentNode.content === 'string'
        ? currentNode.content
        : 'No content available';

      setIsTyping(true);
      setDisplayedText('');

      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(prev => prev + text.charAt(index));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 30); // Adjust speed as needed

      return () => clearInterval(timer);
    }
  }, [currentNode]);

  const handleChoiceSelect = (choice: Choice) => {
    const nextNode = nodes.find(node => node.id === choice.toNodeId);
    if (nextNode) {
      setCurrentNode(nextNode);
    }
  };

  const getCurrentChoices = () => {
    if (!currentNode) return [];
    return choices.filter(choice => choice.fromNodeId === currentNode.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading story...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!currentNode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">No starting node found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {currentNode.title}
          </h1>

          <div className="prose max-w-none mb-8">
            {typeof currentNode.content === 'object' && currentNode.content?.character && (
              <div className="text-sm text-gray-600 mb-2 italic">
                {currentNode.content.character}
              </div>
            )}
            {typeof currentNode.content === 'object' && currentNode.content?.background && (
              <div className="text-sm text-gray-500 mb-4 p-2 bg-gray-50 rounded">
                Background: {currentNode.content.background}
              </div>
            )}
            <div className="text-lg leading-relaxed whitespace-pre-wrap min-h-[200px]">
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </div>
          </div>

          {!isTyping && (
            <div className="space-y-4">
              {getCurrentChoices().map((choice) => (
                <Button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice)}
                  className="w-full text-left justify-start p-4 h-auto whitespace-normal transition-all duration-200 hover:scale-105"
                  variant="outline"
                >
                  {choice.choiceText}
                </Button>
              ))}
            </div>
          )}

          {getCurrentChoices().length === 0 && !isTyping && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-xl">The End</p>
              <Button
                onClick={() => navigate('/stories')}
                className="mt-4"
              >
                Back to Stories
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
