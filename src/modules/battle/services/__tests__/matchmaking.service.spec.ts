import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingService } from '../matchmaking.service';
import { PlayerRepository } from '../../../player/repositories/player.repository';
import { BattleRepository } from '../../repositories/battle.repository';
import { MonsterRepository } from '../../../monster/repositories/monster.repository';
import { BattleGateway } from '../../gateway/battle.gateway';
import { PlayerState } from '../../interfaces/interfaces/player-state.interface';

describe('MatchmakingService', () => {
  let service: MatchmakingService;

  const bots: PlayerState[] = [
    {
      playerId: 'bot1',
      hp: 100,
      attack: 15,
      defense: 5,
      speed: 10,
      specialAbility: 'Fireball',
      isBot: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockBattleRepository = {
    createBattle: jest.fn(),
    getBots: jest.fn().mockReturnValue(bots),
  };

  const mockPlayerRepository = {
    findById: jest.fn(),
  };

  const mockMonsterRepository = {
    findByPlayerId: jest.fn(),
  };

  const mockBattleGateway = {
    notifyBattleStart: jest.fn(),
    getSocketByPlayerId: jest.fn(),
    sendErrorMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchmakingService,
        { provide: BattleRepository, useValue: mockBattleRepository },
        { provide: PlayerRepository, useValue: mockPlayerRepository },
        { provide: MonsterRepository, useValue: mockMonsterRepository },
        { provide: BattleGateway, useValue: mockBattleGateway },
      ],
    }).compile();

    service = module.get<MatchmakingService>(MatchmakingService);
  });

  it('deve retornar um bot como oponente se não houver jogadores disponíveis', async () => {
    const opponent = await service.findOpponent(1, 100); // tempo reduzido

    expect(opponent).toBeDefined();
    expect(opponent!.isBot).toBe(true);
    expect(opponent!.playerId).toBe('bot1');
    expect(mockBattleRepository.getBots).toHaveBeenCalled();
  });

  it('deve retornar um jogador disponível se houver jogadores', async () => {
    const mockPlayerId = 2;

    mockPlayerRepository.findById.mockResolvedValueOnce({ id: mockPlayerId });

    mockMonsterRepository.findByPlayerId.mockResolvedValueOnce([
      {
        hp: 100,
        attack: 20,
        defense: 10,
        speed: 15,
        specialAbility: 'Shadow Strike',
      },
    ]);

    await service.addPlayer(mockPlayerId);

    const opponent = await service.findOpponent(1, 100); // tempo reduzido

    expect(opponent).toBeDefined();
    expect(opponent!.isBot).toBe(false);
    expect(opponent!.playerId).toBe(mockPlayerId.toString());
    expect(opponent!.specialAbility).toBe('Shadow Strike');
  });
});
