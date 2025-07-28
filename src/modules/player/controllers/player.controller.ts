import {
  Controller,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { PlayerCreateService } from '../services/player-create.service';
import { PlayerUpdateService } from '../services/player-update.service';
import { PlayerDeleteService } from '../services/player-delete.service';
import { PlayerFindAllService } from '../services/player-find-all.service';
import { PlayerFindByIdService } from '../services/player-find-by-id.service';
import { PlayerFindByNameService } from '../services/player-find-by-name.service';
import { CreatePlayerDto } from '../interfaces/dto/create-player.dto';
import { UpdatePlayerDto } from '../interfaces/dto/update-player.dto';

@Controller('players')
export class PlayerController {
  constructor(
    private readonly playerCreateService: PlayerCreateService,
    private readonly playerUpdateService: PlayerUpdateService,
    private readonly playerDeleteService: PlayerDeleteService,
    private readonly playerFindAllService: PlayerFindAllService,
    private readonly playerFindByIdService: PlayerFindByIdService,
    private readonly playerFindByNameService: PlayerFindByNameService
  ) {}

  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<any> {
    return await this.playerCreateService.createPlayer(createPlayerDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.playerFindAllService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.playerFindByIdService.findById(id);
  }

  @Get('name/:username')
  async findByName(@Param('username') username: string): Promise<any> {
    return await this.playerFindByNameService.findByName(username);
  }

  @Patch(':id')
  async updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto
  ): Promise<any> {
    return await this.playerUpdateService.updatePlayer(
      id,
      updatePlayerDto.username
    );
  }

  @Delete(':id')
  async deletePlayer(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.playerDeleteService.deletePlayer(id);
    return { message: 'Jogador deletado com sucesso' };
  }
}
