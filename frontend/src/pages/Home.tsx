import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoryCard } from '../components/StoryCard';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { discoveryService, type Story } from '../services/discoveryService';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [trendingStories, setTrendingStories] = useState<Story[]>([]);
  const [recommendedStories, setRecommendedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // Fetch featured stories
      const featuredResult = await discoveryService.getFeaturedStories(6);
      if (featuredResult.success) {
        setFeaturedStories(featuredResult.data);
      }

      // Fetch trending stories
      const trendingResult = await discoveryService.getTrendingStories(6);
      if (trendingResult.success) {
        setTrendingStories(trendingResult.data);
      }

      // Fetch recommended stories (could be based on user preferences in the future)
      const recommendedResult = await discoveryService.discoverStories({
        limit: 6,
        sortBy: 'popular'
      });
      if (recommendedResult.success) {
        setRecommendedStories(recommendedResult.data.stories);
      }

    } catch {
      // Error handling could be added here
    } finally {
      setLoading(false);
    }
  };

  const handleRatingUpdate = (storyId: string, newRating: number) => {
    // Update the stories in all sections
    setFeaturedStories(prev => prev.map(story =>
      story.id === storyId ? { ...story, averageRating: newRating } : story
    ));
    setTrendingStories(prev => prev.map(story =>
      story.id === storyId ? { ...story, averageRating: newRating } : story
    ));
    setRecommendedStories(prev => prev.map(story =>
      story.id === storyId ? { ...story, averageRating: newRating } : story
    ));
  };

  const handleBookmarkToggle = (storyId: string, isBookmarked: boolean) => {
    console.log(`Story ${storyId} ${isBookmarked ? 'bookmarked' : 'unbookmarked'}`);
  };

  const handleFollowToggle = (authorId: string, isFollowing: boolean) => {
    console.log(`Author ${authorId} ${isFollowing ? 'followed' : 'unfollowed'}`);
  };

  const StorySection: React.FC<{
    title: string;
    stories: Story[];
    showViewAll?: boolean;
    viewAllLink?: string;
  }> = ({ title, stories, showViewAll = true, viewAllLink = '/stories' }) => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {showViewAll && (
          <Button
            variant="outline"
            onClick={() => navigate(viewAllLink)}
          >
            View All
          </Button>
        )}
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No stories available
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              showAuthor={true}
              showStats={true}
              onRatingUpdate={handleRatingUpdate}
              onBookmarkToggle={handleBookmarkToggle}
              onFollowToggle={handleFollowToggle}
            />
          ))}
        </div>
      )}
    </section>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing stories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Create & Play Interactive Stories
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing text-based adventures with flexible RPG mechanics.
            Create your own stories or explore worlds crafted by talented authors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/stories')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Explore Stories
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/editor')}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Start Creating
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Quick Stats/Features */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {featuredStories.length + trendingStories.length + recommendedStories.length}
              </div>
              <div className="text-gray-600">Stories Available</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
              <div className="text-gray-600">Creative Possibilities</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">RPG</div>
              <div className="text-gray-600">Flexible Mechanics</div>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <StorySection
            title="Featured Stories"
            stories={featuredStories}
            showViewAll={true}
          />
        )}

        {/* Trending Stories */}
        {trendingStories.length > 0 && (
          <StorySection
            title="Trending Now"
            stories={trendingStories}
            showViewAll={true}
          />
        )}

        {/* Recommended Stories */}
        {recommendedStories.length > 0 && (
          <StorySection
            title="Popular Stories"
            stories={recommendedStories}
            showViewAll={true}
          />
        )}

        {/* Call to Action */}
        <section className="text-center py-16 bg-white rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Story?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of storytellers and bring your imagination to life with our powerful editor and flexible RPG system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
