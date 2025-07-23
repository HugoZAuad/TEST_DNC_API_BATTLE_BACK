import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '../repositories/player.repository';

@Injectable()
export class PlayerFindByNameService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async findByName(username: string) {
    return this.playerRepository.findByName(username);
  }
}
