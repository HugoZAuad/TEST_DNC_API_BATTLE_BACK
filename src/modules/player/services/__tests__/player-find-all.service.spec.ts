import { Test, TestingModule } from '@nestjs/testing';
import { PlayerFindAllService } from '../player-find-all.service';
import { PlayerRepository } from '../../repositories/player.repository';

describe('PlayerFindAllService', () => {
  let service: PlayerFindAllService;
  let repository: PlayerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerFindAllService,
        {
          provide: PlayerRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerFindAllService>(PlayerFindAllService);
    repository = module.get<PlayerRepository>(PlayerRepository);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve chamar repository.findAll e retornar o resultado', async () => {
    const players = [{ id: 1, username: 'player1', wins:0, losses:0, createdAt: new Date(), updatedAt: new Date() }];
    jest.spyOn(repository, 'findAll').mockResolvedValue(players);

    const result = await service.findAll();
    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(players);
  });
});
