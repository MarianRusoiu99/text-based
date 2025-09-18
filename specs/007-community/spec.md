# Feature Specification: Community & Discovery

Feature Branch: `007-community`
Status: Draft

## Goals
- Publishing, browsing, liking, and commenting on stories
- Basic moderation and visibility controls

## Scenarios
- Author publishes a story (toggle public), sets tags
- User browses public stories, filters, sorts, likes
- User comments on a story; author can remove comments on own stories

## Functional Requirements
- FR-001: Publish/unpublish a story (public visibility)
- FR-002: Tags and search
- FR-003: Likes (per user per story)
- FR-004: Comments CRUD with ownership and moderation

## Non-Functional
- Rate limits on likes/comments; safe HTML rendering for comments

## Entities
- Story (existing): isPublic, tags[] JSONB
- StoryLike: id, storyId, userId, createdAt (unique: storyId+userId)
- StoryComment: id, storyId, userId, content, createdAt, updatedAt
