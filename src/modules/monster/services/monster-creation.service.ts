import { Injectable } from '@nestjs/common';
import { Monster } from '@prisma/client';
import { MonsterRepository } from '../repositories/monster.repository';

@Injectable()
export class MonsterCreationService {
  constructor(private readonly monsterRepository: MonsterRepository) {}

  async create(data: {
    name: string;
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    specialAbility: string;
  }, playerId: number): Promise<Monster> {
    return this.monsterRepository.create(data, playerId);
  }
}
