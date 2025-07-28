import { Injectable, BadRequestException } from '@nestjs/common';
import { PlayerRepository } from '../repositories/player.repository';
import { Player } from '@prisma/client';
import { CreatePlayerDto } from '../interfaces/dto/create-player.dto';

@Injectable()
export class PlayerCreateService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { username, winners = 0, losses = 0 } = createPlayerDto;

    if (!username || username.trim() === '') {
      throw new BadRequestException('Informe o nome do jogador');
    }

    return this.playerRepository.create(username, winners, losses);
  }
}
