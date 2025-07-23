import { Injectable } from '@nestjs/common';
import { Monster } from '@prisma/client';
import { MonsterRepository } from '../repositories/monster.repository';

@Injectable()
export class MonsterQueryService {
  constructor(private readonly monsterRepository: MonsterRepository) {}

  async findAll(): Promise<Monster[]> {
    return this.monsterRepository.findAll();
  }

  async findById(id: number): Promise<Monster | null> {
    return this.monsterRepository.findById(id);
  }
}
