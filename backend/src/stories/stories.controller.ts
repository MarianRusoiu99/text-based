import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { CreateStoryVariableDto } from './dto/create-story-variable.dto';
import { UpdateStoryVariableDto } from './dto/update-story-variable.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
}

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createStoryDto: CreateStoryDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.create(req.user.id, createStoryDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.storiesService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user?: AuthenticatedUser },
  ) {
    return this.storiesService.findOne(id, req.user?.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateData: any,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.update(id, req.user.id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: { user: AuthenticatedUser }) {
    return this.storiesService.remove(id, req.user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  publish(
    @Param('id') id: string,
    @Body('isPublished') isPublished: boolean,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.publish(id, req.user.id, isPublished);
  }

  // Chapter endpoints
  @Post(':storyId/chapters')
  @UseGuards(JwtAuthGuard)
  createChapter(
    @Param('storyId') storyId: string,
    @Body() createChapterDto: CreateChapterDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.createChapter(
      storyId,
      req.user.id,
      createChapterDto,
    );
  }

  @Get(':storyId/chapters')
  findChapters(
    @Param('storyId') storyId: string,
    @Request() req: { user?: AuthenticatedUser },
  ) {
    return this.storiesService.findChapters(storyId, req.user?.id);
  }

  @Get(':storyId/chapters/:chapterId')
  findChapter(
    @Param('storyId') storyId: string,
    @Param('chapterId') chapterId: string,
    @Request() req: { user?: AuthenticatedUser },
  ) {
    return this.storiesService.findChapter(storyId, chapterId, req.user?.id);
  }

  @Put(':storyId/chapters/:chapterId')
  @UseGuards(JwtAuthGuard)
  updateChapter(
    @Param('storyId') storyId: string,
    @Param('chapterId') chapterId: string,
    @Body() updateChapterDto: UpdateChapterDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.updateChapter(
      storyId,
      chapterId,
      req.user.id,
      updateChapterDto,
    );
  }

  @Delete(':storyId/chapters/:chapterId')
  @UseGuards(JwtAuthGuard)
  deleteChapter(
    @Param('storyId') storyId: string,
    @Param('chapterId') chapterId: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.deleteChapter(storyId, chapterId, req.user.id);
  }

  @Post(':storyId/chapters/reorder')
  @UseGuards(JwtAuthGuard)
  reorderChapters(
    @Param('storyId') storyId: string,
    @Body('chapterOrders') chapterOrders: { id: string; order: number }[],
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.reorderChapters(
      storyId,
      req.user.id,
      chapterOrders,
    );
  }

  // Story Variables endpoints
  @Post(':storyId/variables')
  @UseGuards(JwtAuthGuard)
  createStoryVariable(
    @Param('storyId') storyId: string,
    @Body() createVariableDto: CreateStoryVariableDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.createStoryVariable(
      storyId,
      req.user.id,
      createVariableDto,
    );
  }

  @Get(':storyId/variables')
  findStoryVariables(
    @Param('storyId') storyId: string,
    @Request() req: { user?: AuthenticatedUser },
  ) {
    return this.storiesService.findStoryVariables(storyId, req.user?.id);
  }

  @Put(':storyId/variables/:variableId')
  @UseGuards(JwtAuthGuard)
  updateStoryVariable(
    @Param('storyId') storyId: string,
    @Param('variableId') variableId: string,
    @Body() updateVariableDto: UpdateStoryVariableDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.updateStoryVariable(
      storyId,
      variableId,
      req.user.id,
      updateVariableDto,
    );
  }

  @Delete(':storyId/variables/:variableId')
  @UseGuards(JwtAuthGuard)
  deleteStoryVariable(
    @Param('storyId') storyId: string,
    @Param('variableId') variableId: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.deleteStoryVariable(
      storyId,
      variableId,
      req.user.id,
    );
  }

  // Items endpoints
  @Post(':storyId/items')
  @UseGuards(JwtAuthGuard)
  createItem(
    @Param('storyId') storyId: string,
    @Body() createItemDto: CreateItemDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.createItem(storyId, req.user.id, createItemDto);
  }

  @Get(':storyId/items')
  findItems(
    @Param('storyId') storyId: string,
    @Request() req: { user?: AuthenticatedUser },
  ) {
    return this.storiesService.findItems(storyId, req.user?.id);
  }

  @Put(':storyId/items/:itemId')
  @UseGuards(JwtAuthGuard)
  updateItem(
    @Param('storyId') storyId: string,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.updateItem(
      storyId,
      itemId,
      req.user.id,
      updateItemDto,
    );
  }

  @Delete(':storyId/items/:itemId')
  @UseGuards(JwtAuthGuard)
  deleteItem(
    @Param('storyId') storyId: string,
    @Param('itemId') itemId: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.storiesService.deleteItem(storyId, itemId, req.user.id);
  }
}
