import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

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
  const { isAuthenticated, accessToken, hydrated } = useAuthStore();

  const { data: profile, isLoading, error } = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: hydrated && isAuthenticated && !!accessToken,
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            {profile?.data.avatarUrl ? (
              <img
                src={profile.data.avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-600">
                {profile?.data.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
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
      </div>
    </div>
  );
};

export default Profile;
