import { MonsterQueryService } from '../monster-query.service';
import { MonsterRepository } from '../../repositories/monster.repository';
import { Monster } from '@prisma/client';

describe('MonsterQueryService', () => {
  let service: MonsterQueryService;
  let repository: MonsterRepository;

  const mockMonster: Monster = {
    id: 1,
    name: 'Goblin',
    hp: 50,
    attack: 10,
    defense: 5,
    speed: 7,
    specialAbility: 'Stealth',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    } as any;
    service = new MonsterQueryService(repository);
  });

  it('deve retornar todos os monstros', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValue([mockMonster]);

    const result = await service.findAll();
    expect(result).toEqual([mockMonster]);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('deve retornar um monstro pelo id', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(mockMonster);

    const result = await service.findById(1);
    expect(result).toEqual(mockMonster);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('deve retornar null se o monstro não for encontrado', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    const result = await service.findById(999);
    expect(result).toBeNull();
  });
});
