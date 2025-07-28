import { Test, TestingModule } from '@nestjs/testing';
import { PlayerCreateService } from '../../services/player-create.service';
import { PlayerRepository } from '../../repositories/player.repository';
import { CreatePlayerDto } from '../../interfaces/dto/create-player.dto';

describe('PlayerCreateService', () => {
  let service: PlayerCreateService;
  let repository: PlayerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerCreateService,
        {
          provide: PlayerRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerCreateService>(PlayerCreateService);
    repository = module.get<PlayerRepository>(PlayerRepository);
  });

  it('deve criar um jogador com sucesso', async () => {
    const dto: CreatePlayerDto = {
      username: 'testuser',
      winners: 0,
      losses: 0,
    };

    const player = {
      id: 1,
      winners: 0,
      losses: 0,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(repository, 'create').mockResolvedValue(player);

    const result = await service.createPlayer(dto);
    expect(result).toEqual(player);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('deve lançar erro se o nome do jogador estiver vazio', async () => {
    const dto: CreatePlayerDto = {
      username: '',
      winners: 0,
      losses: 0,
    };

    await expect(service.createPlayer(dto)).rejects.toThrow(
      'Informe o nome do jogador'
    );
  });
});
