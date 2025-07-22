import { Test, TestingModule } from '@nestjs/testing';
import { PlayerUpdateService } from '../player-update.service';
import { PlayerRepository } from '../../repositories/player.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PlayerUpdateService', () => {
  let service: PlayerUpdateService;
  let repository: PlayerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerUpdateService,
        {
          provide: PlayerRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerUpdateService>(PlayerUpdateService);
    repository = module.get<PlayerRepository>(PlayerRepository);
  });

  it('deve atualizar um jogador com sucesso', async () => {
    const id = 1;
    const usernameAntigo = 'oldUser';
    const usernameNovo = 'updatedUser';

    const playerMock = {
      id,
      username: usernameAntigo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const playerAtualizado = {
      ...playerMock,
      username: usernameNovo,
      updatedAt: new Date(),
    };

    jest.spyOn(repository, 'findById').mockResolvedValue(playerMock);
    jest.spyOn(repository, 'update').mockResolvedValue(playerAtualizado);

    const result = await service.updatePlayer(id, usernameNovo);
    expect(result).toEqual(playerAtualizado);
    expect(repository.findById).toHaveBeenCalledWith(id);
    expect(repository.update).toHaveBeenCalledWith(id, usernameNovo);
  });

  it('deve lançar NotFoundException se o jogador não existir', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    await expect(service.updatePlayer(1, 'anyUser')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar erro se o nome informado for igual ao atual', async () => {
    const id = 1;
    const username = 'sameUser';
    const player = {
      id,
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(repository, 'findById').mockResolvedValue(player);

    await expect(service.updatePlayer(id, username)).rejects.toThrow(
      BadRequestException,
    );
  });
});
