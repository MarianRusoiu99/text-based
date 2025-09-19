import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import {
  StartPlaySessionDto,
  UpdateGameStateDto,
  MakeChoiceDto,
  SaveGameDto,
  LoadGameDto,
  DeleteSavedGameDto,
} from './dto/player.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import type { RequestUser } from '../auth/request-user.interface';

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('sessions')
  @UseGuards(JwtAuthGuard)
  async startSession(
    @Body() startDto: StartPlaySessionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.playerService.startPlaySession(req.user.id, startDto);
  }

  @Get('sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  async getCurrentNode(
    @Param('sessionId') sessionId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.playerService.getCurrentNode(req.user.id, sessionId);
  }

  @Post('sessions/:sessionId/choices')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async makeChoice(
    @Param('sessionId') sessionId: string,
    @Body() choiceDto: MakeChoiceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.playerService.makeChoice(req.user.id, sessionId, choiceDto);
  }

  @Patch('sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  async updateGameState(
    @Param('sessionId') sessionId: string,
    @Body() updateDto: UpdateGameStateDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.playerService.updateGameState(
      req.user.id,
      sessionId,
      updateDto,
    );
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getPlaySessions(
    @Req() req: AuthenticatedRequest,
    @Param('storyId') storyId?: string,
  ) {
    return this.playerService.getPlaySessions(req.user.id, storyId);
  }

  @Get('sessions/:sessionId/details')
  @UseGuards(JwtAuthGuard)
  async getPlaySession(
    @Param('sessionId') sessionId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.playerService.getPlaySession(req.user.id, sessionId);
  }

  @Post('sessions/:sessionId/save')
  @UseGuards(JwtAuthGuard)
  async saveGame(
    @Param('sessionId') sessionId: string,
    @Body() saveDto: SaveGameDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.playerService.savePlaySession(
      req.user.id,
      sessionId,
      saveDto.saveName,
    );
  }

  @Post('saved-games/load')
  @UseGuards(JwtAuthGuard)
  async loadGame(
    @Body() loadDto: LoadGameDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.playerService.loadSavedGame(req.user.id, loadDto.savedGameId);
  }

  @Get('saved-games')
  @UseGuards(JwtAuthGuard)
  async getSavedGames(
    @Req() req: AuthenticatedRequest,
    @Param('storyId') storyId?: string,
  ) {
    return this.playerService.getSavedGames(req.user.id, storyId);
  }

  @Delete('saved-games/:savedGameId')
  @UseGuards(JwtAuthGuard)
  async deleteSavedGame(
    @Param('savedGameId') savedGameId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.playerService.deleteSavedGame(req.user.id, savedGameId);
  }
}
