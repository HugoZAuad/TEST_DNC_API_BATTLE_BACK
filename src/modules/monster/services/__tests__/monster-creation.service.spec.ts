import { MonsterCreationService } from '../monster-creation.service';
import { MonsterRepository } from '../../repositories/monster.repository';
import { Monster } from '@prisma/client';

describe('MonsterCreationService', () => {
  let service: MonsterCreationService;
  let repository: MonsterRepository;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    } as any;
    service = new MonsterCreationService(repository);
  });

  it('deve criar um monstro com dados válidos', async () => {
    const inputData = {
      name: 'Goblin',
      hp: 50,
      attack: 10,
      defense: 5,
      speed: 7,
      specialAbility: 'Stealth',
    };
    const playerId = 1; // ID do jogador
    const expectedMonster: Monster = {
      id: 1,
      ...inputData,
      playerId, // Adicionando playerId
      createdAt: new Date(),
      updatedAt: new Date()
    };

    jest.spyOn(repository, 'create').mockResolvedValue(expectedMonster);

    const result = await service.create(inputData, playerId);
    expect(result).toEqual(expectedMonster);
    expect(repository.create).toHaveBeenCalledWith(inputData, playerId);
  });
});
