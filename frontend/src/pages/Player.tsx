import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playerService, type PlaySession, type Node, type Choice, type SavedGame } from '../services/playerService';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/useToast';
import { CharacterPanel } from '../components/CharacterPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const Player: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [session, setSession] = useState<PlaySession | null>(null);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSaves, setIsLoadingSaves] = useState(false);
  const [startTime] = useState(Date.now());
  const [choiceCount, setChoiceCount] = useState(0);

  useEffect(() => {
    const startPlaySession = async () => {
      if (!storyId || session) return; // Don't start if we already have a session

      try {
        setLoading(true);
        const sessionData = await playerService.startPlaySession({ storyId });
        setSession(sessionData.session);
        setCurrentNode(sessionData.currentNode);
        setChoices([]); // Will be populated when we get current node

        // Show achievement notifications if any
        if (sessionData.unlockedAchievements?.length) {
          sessionData.unlockedAchievements.forEach(achievement => {
            showSuccess(`Achievement Unlocked: ${achievement.name}`, achievement.description);
          });
        }
      } catch (err) {
        console.error('Failed to start play session:', err);
        setError('Failed to start story session');
      } finally {
        setLoading(false);
      }
    };

    startPlaySession();
  }, [storyId]); // Remove showSuccess from dependencies to prevent infinite loop

  useEffect(() => {
    if (session?.id) {
      const loadCurrentNode = async () => {
        try {
          const nodeData = await playerService.getCurrentNode(session.id);
          setCurrentNode(nodeData.node);
          setChoices(nodeData.choices);
        } catch (err) {
          console.error('Failed to load current node:', err);
          setError('Failed to load current node');
        }
      };

      loadCurrentNode();
    }
  }, [session?.id]);

  const formatText = (text: string) => {
    // Split by double newlines to create paragraphs
    return text.split('\n\n').map((paragraph, index) => {
      // Handle horizontal rules
      if (paragraph.trim() === '---') {
        return <hr key={index} className="my-4 border-gray-300" />;
      }

      // Handle dialogue (lines starting with quotes)
      if (paragraph.trim().startsWith('"') && paragraph.includes(':')) {
        const colonIndex = paragraph.indexOf(':');
        const speaker = paragraph.substring(1, colonIndex).trim();
        const dialogue = paragraph.substring(colonIndex + 1).replace(/"/g, '').trim();
        return (
          <div key={index} className="my-2">
            <div className="font-semibold text-blue-600">{speaker}:</div>
            <div className="ml-4 italic text-gray-700">"{dialogue}"</div>
          </div>
        );
      }

      // Handle bold and italic formatting
      const formattedParagraph = paragraph
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

      return (
        <p key={index} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedParagraph }} />
      );
    });
  };

  useEffect(() => {
    if (currentNode) {
      const text = typeof currentNode.content === 'object' && currentNode.content && typeof currentNode.content.text === 'string'
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

  const handleChoiceSelect = async (choice: Choice) => {
    if (!session) return;

    try {
      const result = await playerService.makeChoice(session.id, { choiceId: choice.id });
      setSession(result.session);
      setCurrentNode(result.nextNode);
      setChoices([]); // Will be updated in the next useEffect
      setChoiceCount(prev => prev + 1);

      // Show achievement notifications if any
      if (result.unlockedAchievements?.length) {
        result.unlockedAchievements.forEach(achievement => {
          showSuccess(`Achievement Unlocked: ${achievement.name}`, achievement.description);
        });
      }
    } catch (err) {
      console.error('Failed to make choice:', err);
      showError('Failed to make choice', 'Please try again');
    }
  };

  const handleSaveGame = async () => {
    if (!session || !saveName.trim()) return;

    setIsSaving(true);
    try {
      await playerService.saveGame(session.id, { saveName: saveName.trim() });
      showSuccess('Game saved successfully!', `Saved as "${saveName.trim()}"`);
      setSaveName('');
      setSaveDialogOpen(false);
    } catch (err) {
      console.error('Failed to save game:', err);
      showError('Failed to save game', 'Please try again');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSavedGames = async () => {
    if (!storyId) return;

    setIsLoadingSaves(true);
    try {
      const saves = await playerService.getSavedGames(storyId);
      setSavedGames(saves);
    } catch (err) {
      console.error('Failed to load saved games:', err);
      showError('Failed to load saved games', 'Please try again');
    } finally {
      setIsLoadingSaves(false);
    }
  };

  const handleLoadGame = async (savedGameId: string) => {
    try {
      const sessionData = await playerService.loadGame({ savedGameId });
      setSession(sessionData.session);
      setCurrentNode(sessionData.currentNode);
      setChoices([]); // Will be updated in the next useEffect
      setLoadDialogOpen(false);
      showSuccess('Game loaded successfully!');

      // Show achievement notifications if any
      if (sessionData.unlockedAchievements?.length) {
        sessionData.unlockedAchievements.forEach(achievement => {
          showSuccess(`Achievement Unlocked: ${achievement.name}`, achievement.description);
        });
      }
    } catch (err) {
      console.error('Failed to load game:', err);
      showError('Failed to load game', 'Please try again');
    }
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* Main Story Content */}
          <div className="flex-1">
            {/* Progress Stats */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>⏱️ {Math.floor((Date.now() - startTime) / 1000 / 60)}m {Math.floor(((Date.now() - startTime) / 1000) % 60)}s</span>
                  <span>🎯 {choiceCount} choices made</span>
                  {session?.isCompleted && <span className="text-green-600 font-medium">✅ Completed</span>}
                </div>
                <div className="text-xs text-gray-500">
                  Session: {session?.id.slice(-8)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold mb-6 text-center">
                {currentNode?.title || 'Loading...'}
              </h1>

              {currentNode && (
                <div className="prose max-w-none mb-8">
                  {typeof currentNode.content === 'object' && currentNode.content && typeof currentNode.content.character === 'string' && (
                    <div className="text-sm text-gray-600 mb-2 italic">
                      {currentNode.content.character}
                    </div>
                  )}
                  {typeof currentNode.content === 'object' && currentNode.content && typeof currentNode.content.background === 'string' && (
                    <div className="text-sm text-gray-500 mb-4 p-2 bg-gray-50 rounded">
                      Background: {currentNode.content.background}
                    </div>
                  )}
                  <div className="text-lg leading-relaxed min-h-[200px]">
                    {isTyping ? (
                      <>
                        {displayedText}
                        <span className="animate-pulse">|</span>
                      </>
                    ) : (
                      formatText(displayedText)
                    )}
                  </div>
                </div>
              )}

              {!isTyping && choices.length > 0 && (
                <div className="space-y-4">
                  {choices.map((choice) => (
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

              {choices.length === 0 && !isTyping && currentNode && (
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

          {/* Character Panel */}
          <div className="w-80">
            <CharacterPanel
              characterState={session?.gameState}
              templateConfig={undefined}
              onSaveGame={() => setSaveDialogOpen(true)}
              onLoadGame={() => {
                setLoadDialogOpen(true);
                handleLoadSavedGames();
              }}
              canSave={!!session && !session.isCompleted}
            />

            {/* Save Game Dialog */}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Game</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="saveName">Save Name</Label>
                    <Input
                      id="saveName"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder="Enter a name for your save"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveGame} disabled={!saveName.trim() || isSaving}>
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Load Game Dialog */}
            <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Load Game</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {isLoadingSaves ? (
                    <p>Loading saved games...</p>
                  ) : savedGames.length === 0 ? (
                    <p>No saved games found for this story.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {savedGames.map((save) => (
                        <div key={save.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">{save.saveName}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(save.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button size="sm" onClick={() => handleLoadGame(save.id)}>
                            Load
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setLoadDialogOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
