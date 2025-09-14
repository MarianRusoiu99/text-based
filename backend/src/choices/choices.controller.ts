import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChoicesService } from './choices.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
}

@Controller('choices')
@UseGuards(JwtAuthGuard)
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

  @Post()
  create(
    @Body() createChoiceDto: CreateChoiceDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.choicesService.create(createChoiceDto, req.user.id);
  }

  @Get('story/:storyId')
  findAll(
    @Param('storyId') storyId: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.choicesService.findAll(storyId, req.user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.choicesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChoiceDto: UpdateChoiceDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.choicesService.update(id, updateChoiceDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: { user: AuthenticatedUser }) {
    return this.choicesService.remove(id, req.user.id);
  }
}
