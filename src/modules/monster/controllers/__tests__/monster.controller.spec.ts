import { Test, TestingModule } from '@nestjs/testing';
import { MonsterController } from '../monster.controller';
import { MonsterFindAllService } from '../../services/monster-find-all.service';
import { MonsterFindByIdService } from '../../services/monster-find-by-id.service';
import { MonsterFindByNameService } from '../../services/monster-find-by-name.service';
import { MonsterCreationService } from '../../services/monster-creation.service';
import { MonsterUpdateService } from '../../services/monster-update.service';
import { MonsterDeleteService } from '../../services/monster-delete.service';

describe('MonsterController', () => {
  let controller: MonsterController;
  let findAllService: MonsterFindAllService;
  let findByIdService: MonsterFindByIdService;
  let findByNameService: MonsterFindByNameService;
  let creationService: MonsterCreationService;
  let updateService: MonsterUpdateService;
  let deleteService: MonsterDeleteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonsterController],
      providers: [
        {
          provide: MonsterFindAllService,
          useValue: { findAll: jest.fn() },
        },
        {
          provide: MonsterFindByIdService,
          useValue: { findById: jest.fn() },
        },
        {
          provide: MonsterFindByNameService,
          useValue: { findByName: jest.fn() },
        },
        {
          provide: MonsterCreationService,
          useValue: { create: jest.fn() },
        },
        {
          provide: MonsterUpdateService,
          useValue: { update: jest.fn() },
        },
        {
          provide: MonsterDeleteService,
          useValue: { delete: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<MonsterController>(MonsterController);
    findAllService = module.get<MonsterFindAllService>(MonsterFindAllService);
    findByIdService = module.get<MonsterFindByIdService>(
      MonsterFindByIdService
    );
    findByNameService = module.get<MonsterFindByNameService>(
      MonsterFindByNameService
    );
    creationService = module.get<MonsterCreationService>(
      MonsterCreationService
    );
    updateService = module.get<MonsterUpdateService>(MonsterUpdateService);
    deleteService = module.get<MonsterDeleteService>(MonsterDeleteService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar findAllService.findAll e retornar resultado', async () => {
    const monsters = [
      {
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
      },
    ];
    jest.spyOn(findAllService, 'findAll').mockResolvedValue(monsters);

    const result = await controller.findAll();
    expect(findAllService.findAll).toHaveBeenCalled();
    expect(result).toEqual(monsters);
  });

  it('deve chamar findByIdService.findById e retornar resultado', async () => {
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
    jest.spyOn(findByIdService, 'findById').mockResolvedValue(monster);

    const result = await controller.findById(1);
    expect(findByIdService.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(monster);
  });

  it('deve chamar findByNameService.findByName e retornar resultado', async () => {
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
    jest.spyOn(findByNameService, 'findByName').mockResolvedValue(monster);

    const result = await controller.findByName('monster1');
    expect(findByNameService.findByName).toHaveBeenCalledWith('monster1');
    expect(result).toEqual(monster);
  });

  it('deve chamar updateService.update e retornar resultado', async () => {
    const updateDto = {
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
    jest.spyOn(updateService, 'update').mockResolvedValue(updateDto);

    const result = await controller.updateMonster(1, updateDto);
    expect(updateService.update).toHaveBeenCalledWith(1, updateDto);
    expect(result).toEqual(updateDto);
  });

  it('deve chamar deleteService.delete e retornar mensagem de sucesso', async () => {
    jest.spyOn(deleteService, 'delete').mockResolvedValue(undefined);

    const result = await controller.deleteMonster(1);
    expect(deleteService.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: 'Monstro deletado com sucesso' });
  });
});
