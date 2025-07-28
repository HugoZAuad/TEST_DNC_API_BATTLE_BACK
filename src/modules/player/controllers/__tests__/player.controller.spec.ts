import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from '../player.controller';
import { PlayerCreateService } from '../../services/player-create.service';
import { PlayerUpdateService } from '../../services/player-update.service';
import { PlayerDeleteService } from '../../services/player-delete.service';
import { PlayerFindAllService } from '../../services/player-find-all.service';
import { PlayerFindByIdService } from '../../services/player-find-by-id.service';
import { PlayerFindByNameService } from '../../services/player-find-by-name.service';

describe('PlayerController', () => {
  let controller: PlayerController;
  let createService: PlayerCreateService;
  let updateService: PlayerUpdateService;
  let deleteService: PlayerDeleteService;
  let findAllService: PlayerFindAllService;
  let findByIdService: PlayerFindByIdService;
  let findByNameService: PlayerFindByNameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerCreateService,
          useValue: { createPlayer: jest.fn() },
        },
        {
          provide: PlayerUpdateService,
          useValue: { updatePlayer: jest.fn() },
        },
        {
          provide: PlayerDeleteService,
          useValue: { deletePlayer: jest.fn() },
        },
        {
          provide: PlayerFindAllService,
          useValue: { findAll: jest.fn() },
        },
        {
          provide: PlayerFindByIdService,
          useValue: { findById: jest.fn() },
        },
        {
          provide: PlayerFindByNameService,
          useValue: { findByName: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    createService = module.get<PlayerCreateService>(PlayerCreateService);
    updateService = module.get<PlayerUpdateService>(PlayerUpdateService);
    deleteService = module.get<PlayerDeleteService>(PlayerDeleteService);
    findAllService = module.get<PlayerFindAllService>(PlayerFindAllService);
    findByIdService = module.get<PlayerFindByIdService>(PlayerFindByIdService);
    findByNameService = module.get<PlayerFindByNameService>(PlayerFindByNameService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar findAllService.findAll e retornar resultado', async () => {
    const players = [{ id: 1, username: 'player1', wins:0, losses:0, createdAt: new Date(), updatedAt: new Date() }];
    jest.spyOn(findAllService, 'findAll').mockResolvedValue(players);

    const result = await controller.findAll();
    expect(findAllService.findAll).toHaveBeenCalled();
    expect(result).toEqual(players);
  });

  it('deve chamar findByIdService.findById e retornar resultado', async () => {
    const player = { id: 1, username: 'player1', wins:0, losses:0, createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(findByIdService, 'findById').mockResolvedValue(player);

    const result = await controller.findById(1);
    expect(findByIdService.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(player);
  });

  it('deve chamar findByNameService.findByName e retornar resultado', async () => {
    const player = { id: 1, username: 'player1', wins:0, losses:0, createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(findByNameService, 'findByName').mockResolvedValue(player);

    const result = await controller.findByName('player1');
    expect(findByNameService.findByName).toHaveBeenCalledWith('player1');
    expect(result).toEqual(player);
  });

  it('deve chamar playerCreateService.createPlayer e retornar resultado', async () => {
    const createdPlayer = { id: 1, username: 'newPlayer', wins:0, losses:0, createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(createService, 'createPlayer').mockResolvedValue(createdPlayer);

    const result = await controller.createPlayer({ name: 'newPlayer' });
    expect(createService.createPlayer).toHaveBeenCalledWith('newPlayer');
    expect(result).toEqual(createdPlayer);
  });

  it('deve chamar playerUpdateService.updatePlayer e retornar resultado', async () => {
    const updatedPlayer = { id: 1, username: 'playerUpdated', wins:0, losses:0, createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(updateService, 'updatePlayer').mockResolvedValue(updatedPlayer);

    const result = await controller.updatePlayer(1, { name: 'playerUpdated' });
    expect(updateService.updatePlayer).toHaveBeenCalledWith(1, 'playerUpdated');
    expect(result).toEqual(updatedPlayer);
  });

  it('deve chamar playerDeleteService.deletePlayer e retornar mensagem de sucesso', async () => {
    jest.spyOn(deleteService, 'deletePlayer').mockResolvedValue(undefined);

    const result = await controller.deletePlayer(1);
    expect(deleteService.deletePlayer).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: 'Jogador deletado com sucesso' });
  });
});
