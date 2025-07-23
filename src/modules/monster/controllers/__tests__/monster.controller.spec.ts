import { Test, TestingModule } from '@nestjs/testing';
import { MonsterController } from '../monster.controller';
import { MonsterCreationService } from '../../services/monster-creation.service';
import { MonsterQueryService } from '../../services/monster-query.service';
import { MonsterUpdateService } from '../../services/monster-update.service';
import { MonsterDeleteService } from '../../services/monster-delete.service';
import { CreateMonsterDto } from '../../interfaces/dto/create-monster.dto';
import { UpdateMonsterNameDto } from '../../interfaces/dto/update-monster.dto';
import { MonsterDto } from '../../interfaces/dto/monster.dto';
import { Monster } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MonsterController', () => {
  let controller: MonsterController;
  let creationService: MonsterCreationService;
  let queryService: MonsterQueryService;
  let updateService: MonsterUpdateService;
  let deleteService: MonsterDeleteService;

  const mockMonster: Monster = {
    id: 1,
    name: 'Goblin',
    hp: 50,
    attack: 10,
    defense: 5,
    speed: 7,
    specialAbility: 'Stealth',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonsterController],
      providers: [
        {
          provide: MonsterCreationService,
          useValue: { create: jest.fn() },
        },
        {
          provide: MonsterQueryService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
          },
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
    creationService = module.get<MonsterCreationService>(MonsterCreationService);
    queryService = module.get<MonsterQueryService>(MonsterQueryService);
    updateService = module.get<MonsterUpdateService>(MonsterUpdateService);
    deleteService = module.get<MonsterDeleteService>(MonsterDeleteService);
  });

  it('deve retornar todos os monstros', async () => {
    jest.spyOn(queryService, 'findAll').mockResolvedValue([mockMonster]);
    const result = await controller.findAll();
    expect(result).toEqual([new MonsterDto(mockMonster)]);
  });

  it('deve retornar um monstro por ID', async () => {
    jest.spyOn(queryService, 'findById').mockResolvedValue(mockMonster);
    const result = await controller.findById(1);
    expect(result).toEqual(new MonsterDto(mockMonster));
  });

  it('deve lançar erro se monstro não for encontrado', async () => {
    jest.spyOn(queryService, 'findById').mockResolvedValue(null);
    await expect(controller.findById(999)).rejects.toThrow(
      new HttpException('Monstro não encontrado', HttpStatus.NOT_FOUND),
    );
  });

  it('deve criar um monstro com dados válidos', async () => {
    jest.spyOn(creationService, 'create').mockResolvedValue(mockMonster);
    const dto: CreateMonsterDto = {
      name: 'Goblin',
      hp: 50,
      attack: 10,
      defense: 5,
      speed: 7,
      specialAbility: 'Stealth',
    };
    const result = await controller.create(dto);
    expect(result).toEqual(new MonsterDto(mockMonster));
  });

  it('deve lançar erro ao criar monstro inválido', async () => {
    jest.spyOn(creationService, 'create').mockRejectedValue(new Error('Erro'));
    const dto: CreateMonsterDto = {
      name: '',
      hp: 0,
      attack: 0,
      defense: 0,
      speed: 0,
      specialAbility: '',
    };
    await expect(controller.create(dto)).rejects.toThrow(
      new HttpException('Erro ao criar monstro: Erro', HttpStatus.BAD_REQUEST),
    );
  });

  it('deve atualizar o nome do monstro', async () => {
    jest.spyOn(updateService, 'update').mockResolvedValue(mockMonster);
    const dto: UpdateMonsterNameDto = { name: 'Orc' };
    const result = await controller.update(1, dto);
    expect(result).toEqual(new MonsterDto(mockMonster));
  });

  it('deve lançar erro ao atualizar monstro', async () => {
    jest.spyOn(updateService, 'update').mockRejectedValue(new Error('Falha'));
    const dto: UpdateMonsterNameDto = { name: 'Orc' };
    await expect(controller.update(1, dto)).rejects.toThrow(
      new HttpException('Erro ao atualizar monstro: Falha', HttpStatus.BAD_REQUEST),
    );
  });

  it('deve deletar um monstro', async () => {
    jest.spyOn(deleteService, 'delete').mockResolvedValue(undefined);
    await expect(controller.delete(1)).resolves.toBeUndefined();
  });

  it('deve lançar erro ao deletar monstro', async () => {
    jest.spyOn(deleteService, 'delete').mockRejectedValue(new Error('Falha'));
    await expect(controller.delete(1)).rejects.toThrow(
      new HttpException('Erro ao deletar monstro: Falha', HttpStatus.BAD_REQUEST),
    );
  });
});
