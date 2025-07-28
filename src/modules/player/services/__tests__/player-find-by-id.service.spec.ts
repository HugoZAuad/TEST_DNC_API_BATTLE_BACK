import { Test, TestingModule } from '@nestjs/testing';
import { PlayerFindByIdService } from '../player-find-by-id.service';
import { PlayerRepository } from '../../repositories/player.repository';

describe('PlayerFindByIdService', () => {
  let service: PlayerFindByIdService;
  let repository: PlayerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerFindByIdService,
        {
          provide: PlayerRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerFindByIdService>(PlayerFindByIdService);
    repository = module.get<PlayerRepository>(PlayerRepository);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve chamar repository.findById e retornar o resultado', async () => {
    const player = { id: 1, username: 'player1', wins:0, losses:0, createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(repository, 'findById').mockResolvedValue(player);

    const result = await service.findById(1);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(player);
  });
});
