import { Test, TestingModule } from '@nestjs/testing';
import { PlayerFindByNameService } from '../player-find-by-name.service';
import { PlayerRepository } from '../../repositories/player.repository';

describe('PlayerFindByNameService', () => {
  let service: PlayerFindByNameService;
  let repository: PlayerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerFindByNameService,
        {
          provide: PlayerRepository,
          useValue: {
            findByName: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerFindByNameService>(PlayerFindByNameService);
    repository = module.get<PlayerRepository>(PlayerRepository);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve chamar repository.findByName e retornar o resultado', async () => {
    const player = { id: 1, username: 'player1', createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(repository, 'findByName').mockResolvedValue(player);

    const result = await service.findByName('player1');
    expect(repository.findByName).toHaveBeenCalledWith('player1');
    expect(result).toEqual(player);
  });
});
