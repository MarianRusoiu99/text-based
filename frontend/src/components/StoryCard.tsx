import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Rating } from '@/components/ui/Rating';
import { useAuthStore } from '@/stores/authStore';
import { socialService } from '@/services/socialService';
import { useToast } from '@/hooks/useToast';
import type { Story } from '@/services/discoveryService';

interface StoryCardProps {
  story: Story;
  showAuthor?: boolean;
  showStats?: boolean;
  onRatingUpdate?: (storyId: string, newRating: number) => void;
  onBookmarkToggle?: (storyId: string, isBookmarked: boolean) => void;
  onFollowToggle?: (authorId: string, isFollowing: boolean) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  showAuthor = true,
  showStats = true,
  onRatingUpdate,
  onBookmarkToggle,
  onFollowToggle,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);

  const handlePlay = () => {
    navigate(`/player/${story.id}`);
  };

  const handleEdit = () => {
    navigate(`/editor/${story.id}`);
  };

  const handleRate = async (rating: number) => {
    if (!user) return;

    try {
      await socialService.rateStory(story.id, rating);
      setUserRating(rating);
      showSuccess('Rating submitted!', `You rated "${story.title}" ${rating} stars`);
      onRatingUpdate?.(story.id, rating);
    } catch (error) {
      console.error('Failed to rate story:', error);
      showError('Failed to submit rating', 'Please try again later');
    }
  };

  const handleBookmark = async () => {
    if (!user) return;

    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        await socialService.unbookmarkStory(story.id);
        setIsBookmarked(false);
        showSuccess('Bookmark removed', `"${story.title}" removed from bookmarks`);
      } else {
        await socialService.bookmarkStory(story.id);
        setIsBookmarked(true);
        showSuccess('Story bookmarked!', `"${story.title}" added to bookmarks`);
      }
      onBookmarkToggle?.(story.id, !isBookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      showError('Failed to update bookmark', 'Please try again later');
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleFollow = async () => {
    if (!user) return;

    setIsFollowing(true);
    try {
      if (isFollowingAuthor) {
        await socialService.unfollowUser(story.author.id);
        setIsFollowingAuthor(false);
        showSuccess('Unfollowed author', `No longer following ${story.author.displayName || story.author.username}`);
      } else {
        await socialService.followUser(story.author.id);
        setIsFollowingAuthor(true);
        showSuccess('Author followed!', `Now following ${story.author.displayName || story.author.username}`);
      }
      onFollowToggle?.(story.author.id, !isFollowingAuthor);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      showError('Failed to update follow status', 'Please try again later');
    } finally {
      setIsFollowing(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <Rating
        value={rating}
        readonly={!interactive}
        onChange={interactive ? handleRate : undefined}
        size="sm"
      />
    );
  };

  const isOwnStory = user?.id === story.author.id;

  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-200">
      {story.coverImageUrl && (
        <div className="relative">
          <img
            src={story.coverImageUrl}
            alt={story.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {story.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-900">
              Featured
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {story.title}
          </h3>

          {story.description && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {story.description}
            </p>
          )}

          {showAuthor && (
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={story.author.avatarUrl} alt={story.author.displayName || story.author.username} />
                <AvatarFallback className="text-xs">
                  {(story.author.displayName || story.author.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">
                by {story.author.displayName || story.author.username}
              </span>
              {user && user.id !== story.author.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFollow}
                  disabled={isFollowing}
                  className="ml-auto text-xs px-2 py-1 h-6"
                >
                  {isFollowingAuthor ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Tags and Category */}
          <div className="flex flex-wrap gap-1">
            {story.category && (
              <Badge variant="secondary" className="text-xs">
                {story.category}
              </Badge>
            )}
            {story.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {story.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{story.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Rating */}
          {showStats && story.averageRating && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {renderStars(story.averageRating)}
                <span className="text-sm text-gray-600">
                  {story.averageRating.toFixed(1)} ({story.totalRatings})
                </span>
              </div>
              {user && !isOwnStory && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Rate:</span>
                  {renderStars(userRating || 0, true)}
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          {showStats && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{story.totalPlays || 0} plays</span>
              <span>{story.totalComments || 0} comments</span>
              <span>{new Date(story.publishedAt || story.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex space-x-2">
            {story.isPublished && (
              <Button onClick={handlePlay} size="sm">
                Play
              </Button>
            )}
            {isOwnStory && (
              <Button onClick={handleEdit} variant="outline" size="sm">
                Edit
              </Button>
            )}
          </div>

          {user && !isOwnStory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              disabled={isBookmarking}
              className="text-gray-600 hover:text-gray-900"
            >
              {isBookmarked ? '★' : '☆'} {isBookmarking ? '...' : ''}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};