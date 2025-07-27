import { Test, TestingModule } from '@nestjs/testing';
import { BattleStateService } from '../battle-state.service';
import { BattleRepository } from '../../repositories/battle.repository';

describe('BattleStateService', () => {
  let service: BattleStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleStateService,
        {
          provide: BattleRepository,
          useValue: {
            getState: jest.fn().mockReturnValue({ hp: 100 }),
          },
        },
      ],
    }).compile();

    service = module.get<BattleStateService>(BattleStateService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar o estado atual da batalha', () => {
    const estado = service.getBattleState('player1');
    expect(estado).toEqual({ hp: 100 });
  });
});
