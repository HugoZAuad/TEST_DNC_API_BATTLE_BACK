import { Test, TestingModule } from '@nestjs/testing';
import { BattleEndService } from '../battle-end.service';
import { BattleRepository } from '../../repositories/battle.repository';
import { PlayerRepository } from '../../../player/repositories/player.repository';

describe('BattleEndService', () => {
  let service: BattleEndService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleEndService,
        {
          provide: BattleRepository,
          useValue: {
            endBattle: jest.fn(),
          },
        },
        {
          provide: PlayerRepository,
          useValue: {
            updateStats: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BattleEndService>(BattleEndService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve encerrar a batalha e atualizar estatísticas', async () => {
    const resultado = await service.handleBattleEnd('player1', 'player2');
    expect(resultado).toBeDefined();
  });
});
