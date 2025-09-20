import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storiesService } from '../services/storiesService';
import { rpgService, type RpgTemplate } from '../services/rpgService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import StoryFlow from '../components/StoryFlow';

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const { storyId } = useParams<{ storyId?: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [selectedRpgTemplate, setSelectedRpgTemplate] = useState('');
  const [availableTemplates, setAvailableTemplates] = useState<RpgTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load available RPG templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templates = await rpgService.getTemplates();
        setAvailableTemplates(templates);
      } catch (err) {
        console.error('Failed to load RPG templates:', err);
      }
    };
    
    if (!storyId) {
      loadTemplates();
    }
  }, [storyId]);

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

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await storiesService.createStory({
        title,
        description: description || undefined,
        visibility: visibility as 'public' | 'unlisted' | 'private' | undefined,
        tags: tags.length > 0 ? tags : undefined,
        rpgTemplateId: selectedRpgTemplate || undefined,
      });

      if (result.success && result.data) {
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
            data-testid="story-title-input"
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
            data-testid="story-description-input"
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
            data-testid="visibility-select"
          >
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              id="tag-input"
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Add a tag"
              className="flex-1"
              data-testid="tag-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="outline"
              data-testid="add-tag-button"
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* RPG Template Selection */}
        <div>
          <label htmlFor="rpg-template" className="block text-sm font-medium text-gray-700 mb-2">
            RPG Template (Optional)
          </label>
          <select
            id="rpg-template"
            value={selectedRpgTemplate}
            onChange={(e) => setSelectedRpgTemplate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            data-testid="rpg-template-select"
          >
            <option value="">No RPG Template</option>
            {availableTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Choose an RPG template to add stats, skills, and mechanics to your story.{' '}
            <button
              type="button"
              onClick={() => navigate('/rpg-templates/new')}
              className="text-blue-600 hover:underline"
            >
              Create new template
            </button>
          </p>
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
          data-testid="create-story-button"
        >
          {isLoading ? 'Creating...' : 'Create Story'}
        </Button>
      </form>
    </div>
  );
};

export default Editor;
