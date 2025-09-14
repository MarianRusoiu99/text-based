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
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
}

@Controller('nodes')
@UseGuards(JwtAuthGuard)
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Post()
  create(
    @Body() createNodeDto: CreateNodeDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.nodesService.create(createNodeDto, req.user.id);
  }

  @Get('story/:storyId')
  findAll(
    @Param('storyId') storyId: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.nodesService.findAll(storyId, req.user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.nodesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNodeDto: UpdateNodeDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.nodesService.update(id, updateNodeDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: { user: AuthenticatedUser }) {
    return this.nodesService.remove(id, req.user.id);
  }
}
