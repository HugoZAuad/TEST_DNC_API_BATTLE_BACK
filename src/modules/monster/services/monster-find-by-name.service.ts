import { Injectable } from '@nestjs/common';
import { MonsterRepository } from '../repositories/monster.repository';

@Injectable()
export class MonsterFindByNameService {
  constructor(private readonly monsterRepository: MonsterRepository) {}

  async findByName(name: string) {
    return this.monsterRepository.findByName(name);
  }
}
