import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RpgTemplatesService } from './rpg-templates.service';
import {
  CreateRpgTemplateDto,
  UpdateRpgTemplateDto,
} from './dto/create-rpg-template.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import type { RequestUser } from '../auth/request-user.interface';

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

@Controller('rpg-templates')
export class RpgTemplatesController {
  constructor(private readonly rpgTemplatesService: RpgTemplatesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createRpgTemplateDto: CreateRpgTemplateDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.rpgTemplatesService.create(req.user.id, createRpgTemplateDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.rpgTemplatesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    return this.rpgTemplatesService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateRpgTemplateDto: UpdateRpgTemplateDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.rpgTemplatesService.update(
      id,
      req.user.id,
      updateRpgTemplateDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.rpgTemplatesService.remove(id, req.user.id);
  }
}
