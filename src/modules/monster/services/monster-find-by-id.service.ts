import { Injectable } from '@nestjs/common';
import { MonsterRepository } from '../repositories/monster.repository';

@Injectable()
export class MonsterFindByIdService {
  constructor(private readonly monsterRepository: MonsterRepository) {}

  async findById(id: number) {
    return this.monsterRepository.findById(id);
  }
}
