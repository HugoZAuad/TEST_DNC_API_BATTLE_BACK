import { Test, TestingModule } from '@nestjs/testing';
import { MonsterFindAllService } from '../monster-find-all.service';
import { MonsterRepository } from '../../repositories/monster.repository';

describe('MonsterFindAllService', () => {
  let service: MonsterFindAllService;
  let repository: MonsterRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonsterFindAllService,
        {
          provide: MonsterRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MonsterFindAllService>(MonsterFindAllService);
    repository = module.get<MonsterRepository>(MonsterRepository);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve chamar repository.findAll e retornar o resultado', async () => {
    const monsters = [{
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
    }];
    jest.spyOn(repository, 'findAll').mockResolvedValue(monsters);

    const result = await service.findAll();
    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(monsters);
  });
});
