import { Test, TestingModule } from '@nestjs/testing';
import { PlayerDeleteService } from '../player-delete.service';
import { PlayerRepository } from '../../repositories/player.repository';
import { NotFoundException } from '@nestjs/common';

describe('PlayerDeleteService', () => {
  let service: PlayerDeleteService;
  let repository: PlayerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerDeleteService,
        {
          provide: PlayerRepository,
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerDeleteService>(PlayerDeleteService);
    repository = module.get<PlayerRepository>(PlayerRepository);
  });

  it('deve deletar um jogador com sucesso', async () => {
    const id = 1;
    const player = { id, username: 'testuser', wins:0, losses:0, createdAt: new Date(), updatedAt: new Date() };

    jest.spyOn(repository, 'findById').mockResolvedValue(player);
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

    await expect(service.deletePlayer(id)).resolves.toBeUndefined();
    expect(repository.findById).toHaveBeenCalledWith(id);
    expect(repository.delete).toHaveBeenCalledWith(id);
  });

  it('deve lançar NotFoundException se o jogador não existir', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    await expect(service.deletePlayer(1)).rejects.toThrow(NotFoundException);
  });
});
