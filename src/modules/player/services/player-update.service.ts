import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PlayerRepository } from '../repositories/player.repository';
import { Player } from '@prisma/client';

@Injectable()
export class PlayerUpdateService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async updatePlayer(id: number, username?: string): Promise<Player> {
    const player = await this.playerRepository.findById(id);
    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }
    if (username && username === player.username) {
      throw new BadRequestException('O nome informado é igual ao nome atual do jogador');
    }
    return this.playerRepository.update(id, username);
  }
}
