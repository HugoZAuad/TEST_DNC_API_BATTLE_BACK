import { Injectable } from '@nestjs/common';
import { MonsterRepository } from '../repositories/monster.repository';

@Injectable()
export class MonsterFindAllService {
  constructor(private readonly monsterRepository: MonsterRepository) {}

  async findAll() {
    return this.monsterRepository.findAll();
  }
}
