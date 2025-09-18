import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RpgService } from './rpg.service';
import { CreateRpgTemplateDto } from './dto/create-rpg-template.dto';
import { UpdateRpgTemplateDto } from './dto/update-rpg-template.dto';
import { RequestUser } from '../auth/request-user.interface';

@Controller('rpg/templates')
export class RpgController {
  constructor(private readonly rpgService: RpgService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@Request() req: { user: RequestUser }) {
    return this.rpgService.list(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateRpgTemplateDto,
    @Request() req: { user: RequestUser },
  ) {
    return this.rpgService.create(req.user.id, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  get(@Param('id') id: string, @Request() req: { user: RequestUser }) {
    return this.rpgService.get(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRpgTemplateDto,
    @Request() req: { user: RequestUser },
  ) {
    return this.rpgService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: { user: RequestUser }) {
    return this.rpgService.remove(id, req.user.id);
  }
}
