import { Injectable } from '@nestjs/common';
import { MonsterRepository } from '../repositories/monster.repository';

@Injectable()
export class MonsterDeleteService {
  constructor(private readonly monsterRepository: MonsterRepository) {}

  async delete(id: number): Promise<void> {
    await this.monsterRepository.delete(id);
  }
}
