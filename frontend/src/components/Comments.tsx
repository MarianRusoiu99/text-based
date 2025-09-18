import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialService, type Comment } from '../services/socialService';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { useToast } from '../hooks/useToast';

interface CommentsProps {
  storyId: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Comments: React.FC<CommentsProps> = ({ storyId, isOpen = true, onClose }) => {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', storyId],
    queryFn: () => socialService.getStoryComments(storyId),
    enabled: isOpen,
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => socialService.addComment(storyId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
      setNewComment('');
      showSuccess('Comment added!', 'Your comment has been posted');
    },
    onError: (error) => {
      console.error('Failed to add comment:', error);
      showError('Failed to add comment', 'Please try again');
    },
  });

  const addReplyMutation = useMutation({
    mutationFn: ({ parentId, content }: { parentId: string; content: string }) =>
      socialService.addComment(storyId, content, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
      setReplyingTo(null);
      setReplyText('');
      showSuccess('Reply added!', 'Your reply has been posted');
    },
    onError: (error) => {
      console.error('Failed to add reply:', error);
      showError('Failed to add reply', 'Please try again');
    },
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment.trim());
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;
    addReplyMutation.mutate({ parentId, content: replyText.trim() });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 mt-2' : 'mb-4'}`}>
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.avatarUrl} alt={comment.user.displayName || comment.user.username} />
          <AvatarFallback className="text-xs">
            {(comment.user.displayName || comment.user.username).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-sm">
              {comment.user.displayName || comment.user.username}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
          {!isReply && user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-xs px-2 py-1 h-6"
            >
              Reply
            </Button>
          )}
        </div>
      </div>

      {replyingTo === comment.id && (
        <div className="mt-2 ml-11">
          <div className="flex space-x-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddReply(comment.id);
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => handleAddReply(comment.id)}
              disabled={!replyText.trim() || addReplyMutation.isPending}
            >
              {addReplyMutation.isPending ? '...' : 'Reply'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyingTo(null);
                setReplyText('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Comments</h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>

        {/* Add Comment Form */}
        {user && (
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {(user.displayName || user.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex space-x-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!newComment.trim() || addCommentMutation.isPending}
                >
                  {addCommentMutation.isPending ? '...' : 'Comment'}
                </Button>
              </div>
            </div>
          </form>
        )}

        <Separator className="mb-4" />

        {/* Comments List */}
        {isLoading ? (
          <div className="text-center py-4">Loading comments...</div>
        ) : commentsData?.data.comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet.</p>
            <p className="text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commentsData?.data.comments.map((comment: Comment) => renderComment(comment))}
          </div>
        )}

        {/* Load More Button */}
        {commentsData?.data.pagination && commentsData.data.pagination.page < commentsData.data.pagination.totalPages && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm">
              Load More Comments
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};