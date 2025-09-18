import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:3000';

export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  following: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface StoryRating {
  id: string;
  userId: string;
  storyId: string;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface Comment {
  id: string;
  userId: string;
  storyId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  replies?: Comment[];
  _count?: {
    replies: number;
  };
}

export interface StoryBookmark {
  id: string;
  userId: string;
  storyId: string;
  createdAt: string;
  story: {
    id: string;
    title: string;
    description?: string;
    author: {
      id: string;
      username: string;
      displayName?: string;
    };
    averageRating?: number;
    totalRatings?: number;
  };
}

export interface FollowResponse {
  success: boolean;
  data: UserFollow;
  message: string;
}

export interface RatingResponse {
  success: boolean;
  data: StoryRating;
  message: string;
}

export interface CommentResponse {
  success: boolean;
  data: Comment;
  message: string;
}

export interface BookmarkResponse {
  success: boolean;
  data: StoryBookmark;
  message: string;
}

export interface FollowersResponse {
  success: boolean;
  data: {
    followers: UserFollow[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface RatingsResponse {
  success: boolean;
  data: {
    ratings: StoryRating[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface BookmarksResponse {
  success: boolean;
  data: {
    bookmarks: StoryBookmark[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

class SocialService {
  private getAuthHeaders(): Record<string, string> {
    const token = useAuthStore.getState().accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Following methods
  async followUser(userId: string): Promise<FollowResponse> {
    const response = await fetch(`${API_BASE_URL}/social/users/${userId}/follow`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to follow user: ${response.statusText}`);
    }

    const result: FollowResponse = await response.json();
    return result;
  }

  async unfollowUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/social/users/${userId}/follow`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to unfollow user: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  async getFollowers(
    userId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<FollowersResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/social/users/${userId}/followers?${query}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get followers: ${response.statusText}`);
    }

    const result: FollowersResponse = await response.json();
    return result;
  }

  async getFollowing(
    userId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<FollowersResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/social/users/${userId}/following?${query}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get following: ${response.statusText}`);
    }

    const result: FollowersResponse = await response.json();
    return result;
  }

  async isFollowing(userId: string): Promise<{ success: boolean; data: { isFollowing: boolean } }> {
    const response = await fetch(`${API_BASE_URL}/social/users/${userId}/is-following`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to check follow status: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  // Rating methods
  async rateStory(
    storyId: string,
    rating: number,
    review?: string
  ): Promise<RatingResponse> {
    const response = await fetch(`${API_BASE_URL}/social/stories/${storyId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ rating, review }),
    });

    if (!response.ok) {
      throw new Error(`Failed to rate story: ${response.statusText}`);
    }

    const result: RatingResponse = await response.json();
    return result;
  }

  async getStoryRating(storyId: string): Promise<{ success: boolean; data: StoryRating | null }> {
    const response = await fetch(`${API_BASE_URL}/social/stories/${storyId}/rating`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get story rating: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  async getStoryRatings(
    storyId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<RatingsResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/social/stories/${storyId}/ratings?${query}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get story ratings: ${response.statusText}`);
    }

    const result: RatingsResponse = await response.json();
    return result;
  }

  // Comment methods
  async addComment(
    storyId: string,
    content: string,
    parentId?: string
  ): Promise<CommentResponse> {
    const response = await fetch(`${API_BASE_URL}/social/stories/${storyId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ content, parentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add comment: ${response.statusText}`);
    }

    const result: CommentResponse = await response.json();
    return result;
  }

  async getStoryComments(
    storyId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<CommentsResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/social/stories/${storyId}/comments?${query}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get story comments: ${response.statusText}`);
    }

    const result: CommentsResponse = await response.json();
    return result;
  }

  async deleteComment(commentId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/social/comments/${commentId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete comment: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  // Bookmark methods
  async bookmarkStory(storyId: string): Promise<BookmarkResponse> {
    const response = await fetch(`${API_BASE_URL}/social/stories/${storyId}/bookmark`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to bookmark story: ${response.statusText}`);
    }

    const result: BookmarkResponse = await response.json();
    return result;
  }

  async unbookmarkStory(storyId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/social/stories/${storyId}/bookmark`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to unbookmark story: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  async getBookmarks(
    params: { page?: number; limit?: number } = {}
  ): Promise<BookmarksResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/social/bookmarks?${query}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get bookmarks: ${response.statusText}`);
    }

    const result: BookmarksResponse = await response.json();
    return result;
  }

  async isBookmarked(storyId: string): Promise<{ success: boolean; data: { isBookmarked: boolean } }> {
    const response = await fetch(`${API_BASE_URL}/social/stories/${storyId}/is-bookmarked`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to check bookmark status: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }
}

export const socialService = new SocialService();