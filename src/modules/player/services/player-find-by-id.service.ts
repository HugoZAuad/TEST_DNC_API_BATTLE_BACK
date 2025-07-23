import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '../repositories/player.repository';

@Injectable()
export class PlayerFindByIdService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async findById(id: number) {
    return this.playerRepository.findById(id);
  }
}
