import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { RateStoryDto, AddCommentDto, GetPaginatedDto } from './dto/social.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import type { RequestUser } from '../auth/request-user.interface';

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // Following endpoints
  @Post('users/:userId/follow')
  @UseGuards(JwtAuthGuard)
  async followUser(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.socialService.followUser(req.user.id, userId);
  }

  @Delete('users/:userId/follow')
  @UseGuards(JwtAuthGuard)
  async unfollowUser(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.socialService.unfollowUser(req.user.id, userId);
  }

  @Get('users/:userId/followers')
  async getFollowers(
    @Param('userId') userId: string,
    @Query() query: GetPaginatedDto,
  ) {
    return this.socialService.getFollowers(userId, query.page, query.limit);
  }

  @Get('users/:userId/following')
  async getFollowing(
    @Param('userId') userId: string,
    @Query() query: GetPaginatedDto,
  ) {
    return this.socialService.getFollowing(userId, query.page, query.limit);
  }

  @Get('users/:userId/is-following')
  @UseGuards(JwtAuthGuard)
  async isFollowing(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.socialService.isFollowing(req.user.id, userId);
  }

  // Rating endpoints
  @Post('stories/:storyId/rate')
  @UseGuards(JwtAuthGuard)
  async rateStory(
    @Param('storyId') storyId: string,
    @Body() rateDto: RateStoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.socialService.rateStory(
      req.user.id,
      storyId,
      rateDto.rating,
      rateDto.review,
    );
  }

  @Get('stories/:storyId/rating')
  @UseGuards(JwtAuthGuard)
  async getStoryRating(
    @Param('storyId') storyId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.socialService.getStoryRating(req.user.id, storyId);
  }

  @Get('stories/:storyId/ratings')
  async getStoryRatings(
    @Param('storyId') storyId: string,
    @Query() query: GetPaginatedDto,
  ) {
    return this.socialService.getStoryRatings(storyId, query.page, query.limit);
  }

  // Comment endpoints
  @Post('stories/:storyId/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('storyId') storyId: string,
    @Body() commentDto: AddCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.socialService.addComment(
      req.user.id,
      storyId,
      commentDto.content,
      commentDto.parentCommentId,
    );
  }

  @Get('stories/:storyId/comments')
  async getStoryComments(
    @Param('storyId') storyId: string,
    @Query() query: GetPaginatedDto,
  ) {
    return this.socialService.getStoryComments(
      storyId,
      query.page,
      query.limit,
    );
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.socialService.deleteComment(req.user.id, commentId);
  }

  // Bookmark endpoints
  @Post('stories/:storyId/bookmark')
  @UseGuards(JwtAuthGuard)
  async bookmarkStory(
    @Param('storyId') storyId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.socialService.bookmarkStory(req.user.id, storyId);
  }

  @Delete('stories/:storyId/bookmark')
  @UseGuards(JwtAuthGuard)
  async unbookmarkStory(
    @Param('storyId') storyId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.socialService.unbookmarkStory(req.user.id, storyId);
  }

  @Get('bookmarks')
  @UseGuards(JwtAuthGuard)
  async getUserBookmarks(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetPaginatedDto,
  ) {
    return this.socialService.getUserBookmarks(
      req.user.id,
      query.page,
      query.limit,
    );
  }

  @Get('stories/:storyId/is-bookmarked')
  @UseGuards(JwtAuthGuard)
  async isBookmarked(
    @Param('storyId') storyId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.socialService.isBookmarked(req.user.id, storyId);
  }
}
