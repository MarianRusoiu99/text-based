import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ChoicesService } from './choices.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';

interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
}

@Controller('choices')
// @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

  @Post()
  create(
    @Body() createChoiceDto: CreateChoiceDto,
    @Request() req: { user?: AuthenticatedUser },
  ) {
    return this.choicesService.create(
      createChoiceDto,
      req.user?.id || '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9',
    );
  }

  @Get('story/:storyId')
  findAll(
    @Param('storyId') storyId: string,
    @Request() req: { user?: AuthenticatedUser },
  ) {
    return this.choicesService.findAll(
      storyId,
      req.user?.id || '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9',
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user?: AuthenticatedUser },
  ) {
    return this.choicesService.findOne(
      id,
      req.user?.id || '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9',
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChoiceDto: UpdateChoiceDto,
    @Request() req: { user?: AuthenticatedUser },
  ) {
    return this.choicesService.update(
      id,
      updateChoiceDto,
      req.user?.id || '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9',
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: { user?: AuthenticatedUser },
  ) {
    return this.choicesService.remove(
      id,
      req.user?.id || '1c5268c3-c2b5-4b82-acbe-c4d9a90dead9',
    );
  }
}
