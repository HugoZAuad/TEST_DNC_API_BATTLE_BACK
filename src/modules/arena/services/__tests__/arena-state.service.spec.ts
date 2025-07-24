import { Test, TestingModule } from '@nestjs/testing';
import { ArenaStateService } from '../arena-state.service';
import { ArenaCreationService } from '../arena-creation.service';
import { MatchmakingService } from '../../../battle/services/matchmaking.service';
import { BattleGateway } from '../../../battle/gateway/battle.gateway';

describe('ArenaStateService', () => {
  let service: ArenaStateService;
  let arenaCreationService: ArenaCreationService;
  let matchmakingService: MatchmakingService;
  let battleGateway: BattleGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArenaStateService,
        {
          provide: ArenaCreationService,
          useValue: {
            getArena: jest.fn(),
          },
        },
        {
          provide: MatchmakingService,
          useValue: {
            addPlayer: jest.fn(),
          },
        },
        {
          provide: BattleGateway,
          useValue: {
            getSocketByPlayerId: jest.fn(),
            handleStartBattle: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArenaStateService>(ArenaStateService);
    arenaCreationService = module.get<ArenaCreationService>(ArenaCreationService);
    matchmakingService = module.get<MatchmakingService>(MatchmakingService);
    battleGateway = module.get<BattleGateway>(BattleGateway);
  });

  it('deve abrir uma arena e iniciar o timer', () => {
    jest.useFakeTimers();
    service.openArena('arena1');
    expect(service.isArenaOpen('arena1')).toBe(true);
    jest.advanceTimersByTime(60000);
    expect(service.isArenaOpen('arena1')).toBe(false);
    jest.useRealTimers();
  });

  it('não deve abrir uma arena já aberta', () => {
    service.openArena('arena2');
    service.openArena('arena2');
    expect(service.isArenaOpen('arena2')).toBe(true);
  });

  it('deve fechar a arena e limpar o timer', () => {
    jest.useFakeTimers();
    service.openArena('arena3');
    service.closeArena('arena3');
    expect(service.isArenaOpen('arena3')).toBe(false);
    jest.useRealTimers();
  });

  it('deve iniciar batalhas entre pares de jogadores', async () => {
    const arenaMock = {
      id: 'arena1',
      name: 'Arena Teste',
      players: [
        { player_id: 1, monster_id: 101 },
        { player_id: 2, monster_id: 102 },
        { player_id: 3, monster_id: 103 },
        { player_id: 4, monster_id: 104 },
      ],
      maxPlayers: 4,
    };
    jest.spyOn(arenaCreationService, 'getArena').mockReturnValue(arenaMock);
    jest.spyOn(matchmakingService, 'addPlayer').mockResolvedValue(true);
    jest.spyOn(battleGateway, 'getSocketByPlayerId').mockReturnValue({} as any);
    jest.spyOn(battleGateway, 'handleStartBattle').mockImplementation(async () => {});

    await service['startBattles']('arena1');

    expect(matchmakingService.addPlayer).toHaveBeenCalledTimes(4);
    expect(battleGateway.handleStartBattle).toHaveBeenCalledTimes(4);
  });

  it('deve lidar com jogador ímpar iniciando batalha contra bot', async () => {
    const arenaMock = {
      id: 'arena2',
      name: 'Arena Teste 2',
      players: [
        { player_id: 1, monster_id: 101 },
        { player_id: 2, monster_id: 102 },
        { player_id: 3, monster_id: 103 },
      ],
      maxPlayers: 4,
    };
    jest.spyOn(arenaCreationService, 'getArena').mockReturnValue(arenaMock);
    jest.spyOn(matchmakingService, 'addPlayer').mockResolvedValue(true);
    jest.spyOn(battleGateway, 'getSocketByPlayerId').mockReturnValue({} as any);
    jest.spyOn(battleGateway, 'handleStartBattle').mockImplementation(async () => {});

    await service['startBattles']('arena2');

    expect(matchmakingService.addPlayer).toHaveBeenCalledTimes(3);
    expect(battleGateway.handleStartBattle).toHaveBeenCalledTimes(3);
  });
});
