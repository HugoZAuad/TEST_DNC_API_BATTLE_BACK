import { Injectable, BadRequestException } from '@nestjs/common';
import { PlayerRepository } from '../repositories/player.repository';
import { Player } from '@prisma/client';

@Injectable()
export class PlayerCreateService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async createPlayer(username: string): Promise<Player> {
    if (!username || username.trim() === '') {
      throw new BadRequestException('Informe o nome do jogador');
    }
    return this.playerRepository.create(username);
  }
}
