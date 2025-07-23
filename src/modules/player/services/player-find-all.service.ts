import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '../repositories/player.repository';

@Injectable()
export class PlayerFindAllService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async findAll() {
    return this.playerRepository.findAll();
  }
}
