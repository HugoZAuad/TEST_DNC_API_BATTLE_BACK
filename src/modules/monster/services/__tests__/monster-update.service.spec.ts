import { MonsterUpdateService } from '../monster-update.service';
import { MonsterRepository } from '../../repositories/monster.repository';
import { Monster } from '@prisma/client';

describe('MonsterUpdateService', () => {
  let service: MonsterUpdateService;
  let repository: MonsterRepository;

  const updatedMonster: Monster = {
    id: 1,
    name: 'Orc',
    playerId: 1,
    hp: 60,
    attack: 12,
    defense: 6,
    speed: 5,
    specialAbility: 'Rage',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-03T00:00:00.000Z'),
  };

  beforeEach(() => {
    repository = {
      update: jest.fn(),
    } as any;
    service = new MonsterUpdateService(repository);
  });

  it('deve atualizar o nome do monstro', async () => {
    jest.spyOn(repository, 'update').mockResolvedValue(updatedMonster);

    const result = await service.update(1, { name: 'Orc' });
    expect(result).toEqual(updatedMonster);
    expect(repository.update).toHaveBeenCalledWith(1, { name: 'Orc' });
  });

  it('deve lançar erro se a atualização falhar', async () => {
    jest.spyOn(repository, 'update').mockRejectedValue(new Error('Falha na atualização'));

    await expect(service.update(1, { name: 'Orc' })).rejects.toThrow('Falha na atualização');
  });

  it('não deve permitir atualização de campos fora do DTO', async () => {
  const invalidUpdateData = { hp: 999 } as any;
  jest.spyOn(repository, 'update').mockImplementation(() => {
    throw new Error('Campo não permitido: hp');
  });

  await expect(service.update(1, invalidUpdateData)).rejects.toThrow('Campo não permitido: hp');
  expect(repository.update).toHaveBeenCalledWith(1, invalidUpdateData);
});
});
