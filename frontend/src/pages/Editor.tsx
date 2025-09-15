import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storiesService } from '../services/storiesService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import StoryFlow from '../components/StoryFlow';

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const { storyId } = useParams<{ storyId?: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePublish = async (id: string) => {
    try {
      await storiesService.publishStory(id, true);
      alert('Story published successfully!');
    } catch (error) {
      console.error('Failed to publish story:', error);
      alert('Failed to publish story');
    }
  };

  if (storyId) {
    // Show node editor - full width
    return (
      <div className="h-full w-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-white flex-shrink-0">
          <h1 className="text-3xl font-bold">Story Editor - {storyId}</h1>
          <div className="space-x-4">
            <Button onClick={() => navigate(`/player/${storyId}`)} variant="outline">
              Preview Story
            </Button>
            <Button onClick={() => handlePublish(storyId)}>Publish Story</Button>
          </div>
        </div>
        <div className="flex-1 h-full">
          <StoryFlow storyId={storyId} />
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await storiesService.createStory({
        title,
        description: description || undefined,
        visibility,
      });

      if (result.success) {
        // Navigate to the story editor
        navigate(`/editor/${result.data.id}`);
      } else {
        setError(result.message || 'Failed to create story');
      }
    } catch {
      setError('An error occurred while creating the story');
    } finally {
      setIsLoading(false);
    }
  };

  // Show create form
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Story</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            required
            placeholder="Enter story title"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter story description (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
            Visibility
          </label>
          <select
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
            <option value="public">Public</option>
          </select>
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="w-full"
        >
          {isLoading ? 'Creating...' : 'Create Story'}
        </Button>
      </form>
    </div>
  );
};

export default Editor;
