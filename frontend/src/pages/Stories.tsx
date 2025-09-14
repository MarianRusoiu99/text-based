import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storiesService } from '../services/storiesService';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';

interface Story {
  id: string;
  title: string;
  description?: string;
  author: {
    id: string;
    username: string;
    displayName?: string;
  };
  createdAt: string;
  isPublished: boolean;
}

const Stories: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const result = await storiesService.getStories();
        if (result.success) {
          setStories(result.data.stories);
        } else {
          setError('Failed to load stories');
        }
      } catch {
        setError('An error occurred while loading stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return <div className="text-center">Loading stories...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Stories</h1>
      {stories.length === 0 ? (
        <p>No stories found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <div key={story.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">{story.title}</h2>
              {story.description && (
                <p className="text-gray-600 mb-2">{story.description}</p>
              )}
              <div className="text-sm text-gray-500 mb-4">
                By {story.author.displayName || story.author.username}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                {new Date(story.createdAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                {story.isPublished && (
                  <Button
                    onClick={() => navigate(`/player/${story.id}`)}
                    size="sm"
                  >
                    Play
                  </Button>
                )}
                {user && user.id === story.author.id && (
                  <Button
                    onClick={() => navigate(`/editor/${story.id}`)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stories;
