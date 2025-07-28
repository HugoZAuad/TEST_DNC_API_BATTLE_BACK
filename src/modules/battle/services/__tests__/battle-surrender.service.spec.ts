import { Test, TestingModule } from '@nestjs/testing';
import { BattleSurrenderService } from '../battle-surrender.service';
import { BattleStatsService } from '../battle-stats.service';
import { BattleState } from '../../interfaces/interfaces/battle-state.interface';
import { PlayerState } from '../../interfaces/interfaces/player-state.interface';

describe('BattleSurrenderService', () => {
  let service: BattleSurrenderService;
  let statsService: BattleStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleSurrenderService,
        {
          provide: BattleStatsService,
          useValue: {
            recordVictory: jest.fn(),
            recordDefeat: jest.fn(),
            recordSurrender: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BattleSurrenderService>(BattleSurrenderService);
    statsService = module.get<BattleStatsService>(BattleStatsService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve finalizar a batalha e registrar vitória, derrota e rendição corretamente', () => {
    const players: PlayerState[] = [
      {
        playerId: 'player1',
        hp: 100,
        attack: 10,
        defense: 5,
        speed: 7,
        specialAbility: 'None',
        isBot: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        playerId: 'player2',
        hp: 100,
        attack: 10,
        defense: 5,
        speed: 7,
        specialAbility: 'None',
        isBot: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const battleState: BattleState = {
      id: 'battle1',
      players,
      currentTurnPlayerId: 'player1',
      isBattleActive: true,
    };

    const result = service.surrender(battleState, 'player1');

    expect(result.isBattleActive).toBe(false);
    expect(result.winnerId).toBe('player2');
    expect(statsService.recordVictory).toHaveBeenCalledWith('player2');
    expect(statsService.recordDefeat).toHaveBeenCalledWith('player1');
    expect(statsService.recordSurrender).toHaveBeenCalledWith('player1');
  });
});
