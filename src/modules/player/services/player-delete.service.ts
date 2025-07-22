import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayerRepository } from '../repositories/player.repository';

@Injectable()
export class PlayerDeleteService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async deletePlayer(id: number): Promise<void> {
    const player = await this.playerRepository.findById(id);
    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }
    await this.playerRepository.delete(id);
  }
}
