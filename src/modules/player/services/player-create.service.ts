import { Injectable, BadRequestException } from '@nestjs/common';
import { PlayerRepository } from '../repositories/player.repository';
import { Player } from '@prisma/client';
import { CreatePlayerDto } from '../interfaces/dto/create-player.dto'; // Ajuste o caminho conforme necessário

@Injectable()
export class PlayerCreateService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { name, wins = 0, losses = 0 } = createPlayerDto;

    if (!name || name.trim() === '') {
      throw new BadRequestException('Informe o nome do jogador');
    }

    return this.playerRepository.create(name, wins, losses);
  }
}
