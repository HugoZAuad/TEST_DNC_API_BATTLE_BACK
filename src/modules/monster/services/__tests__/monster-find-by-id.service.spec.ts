import { Test, TestingModule } from '@nestjs/testing';
import { MonsterFindByIdService } from '../monster-find-by-id.service';
import { MonsterRepository } from '../../repositories/monster.repository';

describe('MonsterFindByIdService', () => {
  let service: MonsterFindByIdService;
  let repository: MonsterRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonsterFindByIdService,
        {
          provide: MonsterRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MonsterFindByIdService>(MonsterFindByIdService);
    repository = module.get<MonsterRepository>(MonsterRepository);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve chamar repository.findById e retornar o resultado', async () => {
    const monster = {
      id: 1,
      name: 'monster1',
      playerId: 1,
      hp: 100,
      attack: 10,
      defense: 5,
      speed: 7,
      specialAbility: 'fireball',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(repository, 'findById').mockResolvedValue(monster);

    const result = await service.findById(1);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(monster);
  });
});
