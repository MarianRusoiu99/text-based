import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { socialService } from '../services/socialService';
import { discoveryService, type Story } from '../services/discoveryService';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FollowingUser {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
}

interface ActivityItem {
  type: 'story_created' | 'comment_added' | 'rating_given';
  user: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  story?: {
    id: string;
    title: string;
  };
  timestamp: string;
  content: string;
}

interface ProfileResponse {
  success: boolean;
  data: UserProfile;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    avatarUrl: '',
  });

  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: profile, isLoading, error } = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: !!user,
  });

  const { data: followersData } = useQuery({
    queryKey: ['followers', user?.id],
    queryFn: () => user ? socialService.getFollowers(user.id) : null,
    enabled: !!user,
  });

  const { data: followingData } = useQuery({
    queryKey: ['following', user?.id],
    queryFn: () => user ? socialService.getFollowing(user.id) : null,
    enabled: !!user,
  });

  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: () => user ? socialService.getBookmarks() : null,
    enabled: !!user,
  });

  // Recent activity from followed users
  const { data: recentActivity } = useQuery<ActivityItem[]>({
    queryKey: ['recent-activity', user?.id],
    queryFn: async (): Promise<ActivityItem[]> => {
      if (!user) return [];
      
      // Get following list
      const following = await socialService.getFollowing(user.id, { limit: 50 });
      if (!following.data.following.length) return [];
      
      // For now, just get recent stories from followed users (simplified activity feed)
      const recentStories = await discoveryService.discoverStories({ 
        limit: 10, 
        sortBy: 'newest' 
      });
      
      // Mock activity data - in reality this would come from a dedicated endpoint
      return recentStories.data.stories.slice(0, 5).map((story: Story): ActivityItem => ({
        type: 'story_created',
        user: story.author,
        story: story,
        timestamp: story.createdAt,
        content: `created a new story "${story.title}"`
      }));
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (profile?.data) {
      setFormData({
        displayName: profile.data.displayName || '',
        bio: profile.data.bio || '',
        avatarUrl: profile.data.avatarUrl || '',
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile?.data?.avatarUrl} alt={profile?.data ? (profile.data.displayName || profile.data.username) : ''} />
                  <AvatarFallback className="text-2xl">
                    {profile?.data ? (profile.data.displayName || profile.data.username).charAt(0).toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{profile?.data.displayName || profile?.data.username}</h2>
                  <p className="text-gray-600">@{profile?.data.username}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(profile?.data.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-gray-700">{profile?.data.email}</p>
                  </div>
                  <div>
                    <Label>Bio</Label>
                    <p className="text-gray-700">{profile?.data.bio || 'No bio yet'}</p>
                  </div>
                  <div>
                    <Label>Display Name</Label>
                    <p className="text-gray-700">{profile?.data.displayName || 'Not set'}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)} className="mt-4">
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="Your display name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Social Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {followersData?.data.pagination.total || 0}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {followingData?.data.pagination.total || 0}
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bookmarked Stories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {bookmarksData?.data.pagination.total || 0}
                </div>
                <div className="text-sm text-gray-600">Stories saved</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Followers and Following Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Followers</CardTitle>
          </CardHeader>
          <CardContent>
            {followersData?.data.followers.length ? (
              <div className="space-y-3">
                {followersData.data.followers.slice(0, 5).map((follower) => (
                  <div key={follower.id} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={follower.follower.avatarUrl} alt={follower.follower.displayName || follower.follower.username} />
                      <AvatarFallback className="text-xs">
                        {(follower.follower.displayName || follower.follower.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {follower.follower.displayName || follower.follower.username}
                      </p>
                      <p className="text-xs text-gray-500">@{follower.follower.username}</p>
                    </div>
                  </div>
                ))}
                {followersData.data.pagination.total > 5 && (
                  <p className="text-sm text-gray-600 text-center">
                    And {followersData.data.pagination.total - 5} more...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No followers yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Following</CardTitle>
          </CardHeader>
          <CardContent>
            {followingData?.data.following.length ? (
              <div className="space-y-3">
                {followingData.data.following.slice(0, 5).map((following: FollowingUser) => (
                  <div key={following.id} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={following.avatarUrl} alt={following.displayName || following.username} />
                      <AvatarFallback className="text-xs">
                        {(following.displayName || following.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {following.displayName || following.username}
                      </p>
                      <p className="text-xs text-gray-500">@{following.username}</p>
                    </div>
                  </div>
                ))}
                {followingData.data.pagination.total > 5 && (
                  <p className="text-sm text-gray-600 text-center">
                    And {followingData.data.pagination.total - 5} more...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Not following anyone yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentActivity && recentActivity.length > 0 && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatarUrl} alt={activity.user.displayName || activity.user.username} />
                      <AvatarFallback className="text-xs">
                        {(activity.user.displayName || activity.user.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">
                          {activity.user.displayName || activity.user.username}
                        </span>
                        {' '}
                        {activity.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
