import { Injectable } from '@nestjs/common';
import { Monster } from '@prisma/client';
import { MonsterRepository } from '../repositories/monster.repository';

@Injectable()
export class MonsterUpdateService {
  constructor(private readonly monsterRepository: MonsterRepository) {}

  async update(id: number, data: { name: string }): Promise<Monster> {
    return this.monsterRepository.update(id, data);
  }
}
