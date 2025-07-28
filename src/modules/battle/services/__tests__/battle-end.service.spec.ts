import { Test, TestingModule } from '@nestjs/testing';
import { BattleEndService } from '../battle-end.service';
import { BattleRepository } from '../../repositories/battle.repository';
import { PlayerRepository } from '../../../player/repositories/player.repository';

describe('BattleEndService', () => {
  let service: BattleEndService;

  const mockBattleRepository = {
    endBattle: jest.fn(),
  };

  const mockPlayerRepository = {
    updateStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleEndService,
        {
          provide: BattleRepository,
          useValue: mockBattleRepository,
        },
        {
          provide: PlayerRepository,
          useValue: mockPlayerRepository,
        },
      ],
    }).compile();

    service = module.get<BattleEndService>(BattleEndService);
  });

  it('deve encerrar a batalha e atualizar estatísticas', async () => {
    await service.handleBattleEnd('player1', 'player2');

    expect(mockBattleRepository.endBattle).toHaveBeenCalledWith('player1', 'player2');
    expect(mockPlayerRepository.updateStats).toHaveBeenCalledWith('player1', { wins: 1 });
    expect(mockPlayerRepository.updateStats).toHaveBeenCalledWith('player2', { losses: 1 });
  });
});
