import { MonsterDeleteService } from '../monster-delete.service';
import { MonsterRepository } from '../../repositories/monster.repository';

describe('MonsterDeleteService', () => {
  let service: MonsterDeleteService;
  let repository: MonsterRepository;

  beforeEach(() => {
    repository = {
      delete: jest.fn(),
    } as any;
    service = new MonsterDeleteService(repository);
  });

  it('deve deletar um monstro pelo id', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
