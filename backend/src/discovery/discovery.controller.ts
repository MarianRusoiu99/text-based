import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DiscoveryService } from './discovery.service';
import { DiscoverStoriesDto } from './dto/discover-stories.dto';
import type { Request } from 'express';
import type { RequestUser } from '../auth/request-user.interface';

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('stories')
  async discoverStories(
    @Query(new ValidationPipe({ transform: true })) filters: DiscoverStoriesDto,
  ) {
    return this.discoveryService.discoverStories(filters);
  }

  @Get('featured')
  async getFeaturedStories(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.discoveryService.getFeaturedStories(limit);
  }

  @Get('trending')
  async getTrendingStories(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.discoveryService.getTrendingStories(limit);
  }

  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  async getRecommendedStories(
    @Req() req: AuthenticatedRequest,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.discoveryService.getRecommendedStories(req.user.id, limit);
  }

  @Get('categories')
  async getCategories() {
    return this.discoveryService.getCategories();
  }

  @Get('tags')
  async getTags(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.discoveryService.getTags(limit);
  }
}
