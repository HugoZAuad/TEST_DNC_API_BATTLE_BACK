import { Test, TestingModule } from '@nestjs/testing';
import { MonsterFindByNameService } from '../monster-find-by-name.service';
import { MonsterRepository } from '../../repositories/monster.repository';

describe('MonsterFindByNameService', () => {
  let service: MonsterFindByNameService;
  let repository: MonsterRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonsterFindByNameService,
        {
          provide: MonsterRepository,
          useValue: {
            findByName: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MonsterFindByNameService>(MonsterFindByNameService);
    repository = module.get<MonsterRepository>(MonsterRepository);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve chamar repository.findByName e retornar o resultado', async () => {
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
    jest.spyOn(repository, 'findByName').mockResolvedValue(monster);

    const result = await service.findByName('monster1');
    expect(repository.findByName).toHaveBeenCalledWith('monster1');
    expect(result).toEqual(monster);
  });
});
