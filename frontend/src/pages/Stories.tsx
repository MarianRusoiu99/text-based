import React, { useState, useEffect, useCallback } from 'react';
import { StoryCard } from '../components/StoryCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { discoveryService, type Story, type StoryFilters } from '../services/discoveryService';
import { useAuthStore } from '../stores/authStore';
import { useQuery } from '@tanstack/react-query';

const Stories: React.FC = () => {
  const { user } = useAuthStore();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<StoryFilters>({
    page: 1,
    limit: 20,
    sortBy: 'newest'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'popular' | 'trending'>('newest');

  const categories = ['Adventure', 'Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Horror', 'Comedy', 'Drama'];
  const popularTags = ['interactive', 'choose-your-own-adventure', 'rpg', 'short-story', 'long-form', 'experimental'];

  // Social discovery queries
  const { data: trendingStories } = useQuery({
    queryKey: ['trending-stories'],
    queryFn: () => discoveryService.getTrendingStories(6),
  });

  const { data: recommendedStories } = useQuery({
    queryKey: ['recommended-stories', user?.id],
    queryFn: () => discoveryService.getRecommendedStories(6),
    enabled: !!user,
  });

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const result = await discoveryService.discoverStories({
        ...filters,
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        sortBy: sortBy
      });

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
  }, [filters, searchQuery, selectedCategory, selectedTags, sortBy]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    setFilters(prev => ({ ...prev, page: 1, sortBy: newSort }));
  };

  const handleRatingUpdate = (storyId: string, newRating: number) => {
    setStories(prev => prev.map(story =>
      story.id === storyId
        ? { ...story, averageRating: newRating }
        : story
    ));
  };

  const handleBookmarkToggle = (storyId: string, isBookmarked: boolean) => {
    // Could update local state or refetch if needed
    console.log(`Story ${storyId} ${isBookmarked ? 'bookmarked' : 'unbookmarked'}`);
  };

  const handleFollowToggle = (authorId: string, isFollowing: boolean) => {
    // Could update local state or refetch if needed
    console.log(`Author ${authorId} ${isFollowing ? 'followed' : 'unfollowed'}`);
  };

  if (loading && stories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading stories...</div>
      </div>
    );
  }

  if (error && stories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Discover Stories</h1>

        {/* Trending Stories */}
        {trendingStories?.data && trendingStories.data.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">🔥 Trending Now</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortBy('trending')}
                className="text-blue-600 hover:text-blue-800"
              >
                View All
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {trendingStories.data.map((story) => (
                <div key={story.id} className="transform hover:scale-105 transition-transform">
                  <StoryCard
                    story={story}
                    showAuthor={false}
                    showStats={false}
                    onRatingUpdate={handleRatingUpdate}
                    onBookmarkToggle={handleBookmarkToggle}
                    onFollowToggle={handleFollowToggle}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Stories */}
        {recommendedStories?.data && recommendedStories.data.length > 0 && user && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">✨ Recommended for You</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortBy('rating')}
                className="text-green-600 hover:text-green-800"
              >
                View Similar
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {recommendedStories.data.map((story) => (
                <div key={story.id} className="transform hover:scale-105 transition-transform">
                  <StoryCard
                    story={story}
                    showAuthor={false}
                    showStats={false}
                    onRatingUpdate={handleRatingUpdate}
                    onBookmarkToggle={handleBookmarkToggle}
                    onFollowToggle={handleFollowToggle}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
            <Button onClick={handleSearch} className="md:col-span-2 lg:col-span-1">
              Search
            </Button>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No stories found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedTags([]);
                setSortBy('newest');
                setFilters({ page: 1, limit: 20, sortBy: 'newest' });
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Found {stories.length} stories
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onRatingUpdate={handleRatingUpdate}
                  onBookmarkToggle={handleBookmarkToggle}
                  onFollowToggle={handleFollowToggle}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Stories;
