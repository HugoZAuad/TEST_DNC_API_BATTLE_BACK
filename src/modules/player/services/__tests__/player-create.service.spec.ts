import { Test, TestingModule } from '@nestjs/testing';
import { PlayerCreateService } from '../../services/player-create.service';
import { PlayerRepository } from '../../repositories/player.repository';

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
    const username = 'testuser';
    const player = {
      id: 1,
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(repository, 'create').mockResolvedValue(player);

    const result = await service.createPlayer(username);
    expect(result).toEqual(player);
    expect(repository.create).toHaveBeenCalledWith(username);
  });

  it('deve lançar erro se o nome do jogador estiver vazio', async function(this: void) {
    await expect(service.createPlayer('')).rejects.toThrow(
      'Informe o nome do jogador',
    );
  });
});
