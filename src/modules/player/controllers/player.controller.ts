import {
  Controller,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { PlayerCreateService } from '../services/player-create.service';
import { PlayerUpdateService } from '../services/player-update.service';
import { PlayerDeleteService } from '../services/player-delete.service';
import { CreatePlayerDto } from '../interfaces/dto/create-player.dto';
import { UpdatePlayerDto } from '../interfaces/dto/update-player.dto';

@Controller('players')
export class PlayerController {
  constructor(
    private readonly playerCreateService: PlayerCreateService,
    private readonly playerUpdateService: PlayerUpdateService,
    private readonly playerDeleteService: PlayerDeleteService,
  ) {}

  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<any> {
    return await this.playerCreateService.createPlayer(createPlayerDto.name);
  }

  @Patch(':id')
  async updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<any> {
    return await this.playerUpdateService.updatePlayer(
      id,
      updatePlayerDto.name,
    );
  }

  @Delete(':id')
  async deletePlayer(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.playerDeleteService.deletePlayer(id);
    return { message: 'Jogador deletado com sucesso' };
  }
}
