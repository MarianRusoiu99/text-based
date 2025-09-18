import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RpgService } from './rpg.service';
import { RequestUser } from '../auth/request-user.interface';

@Controller('stories/:storyId/rpg-template')
export class StoryRpgController {
  constructor(private readonly rpgService: RpgService) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  attach(
    @Param('storyId') storyId: string,
    @Body('templateId') templateId: string,
    @Request() req: { user: RequestUser },
  ) {
    return this.rpgService.attachTemplateToStory(
      storyId,
      templateId,
      req.user.id,
    );
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  detach(
    @Param('storyId') storyId: string,
    @Request() req: { user: RequestUser },
  ) {
    return this.rpgService.detachTemplateFromStory(storyId, req.user.id);
  }
}
