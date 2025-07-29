import { ArenaActionService } from '../arena-action.service';
import { ArenaCreationService } from '../arena-creation.service';
import { BattleGateway } from '../../../battle/gateway/battle.gateway';
import { BattleTurnService } from '../../../battle/services/battle-turn.service';
import { ArenaEndService } from '../arena-end.service';
import { BotAIService } from '../../../battle/services/bot-ai.service';
import { ArenaDto } from '../../interfaces/dto/arena.dto';

describe('ArenaActionService', () => {
  let service: ArenaActionService;
  let arenaCreationService: ArenaCreationService;
  let battleGateway: BattleGateway;
  let turnService: BattleTurnService;
  let arenaEndService: ArenaEndService;
  let botAIService: BotAIService;

  const arenaId = 'arena1';
  const playerId = '1';
  const targetId = '2';

  const mockArena: ArenaDto = {
    id: arenaId,
    battleState: {
      currentTurnPlayerId: playerId,
      players: [
        { playerId, username: 'Player One' },
        { playerId: targetId, username: 'Player Two' },
      ],
      monsters: [
        {
          playerId,
          name: 'Dragon',
          hp: 100,
          maxHp: 100,
          attack: 20,
          defense: 10,
        },
        {
          playerId: targetId,
          name: 'Goblin',
          hp: 50,
          maxHp: 50,
          attack: 15,
          defense: 5,
        },
      ],
    },
    name: '',
    maxPlayers: 0,
    players: []
  };

  beforeEach(() => {
    arenaCreationService = {
      getArena: jest.fn().mockReturnValue(mockArena),
    } as any;

    battleGateway = {
      server: {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      },
    } as any;

    turnService = {
      isPlayerTurn: jest.fn().mockReturnValue(true),
      switchTurn: jest.fn().mockReturnValue({
        ...mockArena.battleState,
        currentTurnPlayerId: targetId,
      }),
    } as any;

    arenaEndService = {
      endBattle: jest.fn(),
    } as any;

    botAIService = {
      executeBotTurn: jest.fn().mockResolvedValue('🤖 Bot atacou!'),
    } as any;

    service = new ArenaActionService(
      arenaCreationService,
      battleGateway,
      turnService,
      arenaEndService,
      botAIService
    );
  });

  it('should execute attack action', async () => {
    const result = await service.playerAction(arenaId, {
      player_id: Number(playerId),
      action: 'attack',
      target_id: Number(targetId),
    });

    expect(result.message).toContain('executada com sucesso');
    expect(battleGateway.server.to).toHaveBeenCalledWith(arenaId);
    expect(battleGateway.server.emit).toHaveBeenCalledWith(
      'battleTurnEnded',
      expect.objectContaining({
        actions: [expect.stringContaining('atacou')],
      })
    );
  });

  it('should execute defend action', async () => {
    const result = await service.playerAction(arenaId, {
      player_id: Number(playerId),
      action: 'defend',
    });

    expect(result.message).toContain('executada com sucesso');
    expect(mockArena.battleState.monsters[0].defense).toBeGreaterThan(10);
  });

  it('should execute special action', async () => {
    mockArena.battleState.monsters[0].hp = 80;
    const result = await service.playerAction(arenaId, {
      player_id: Number(playerId),
      action: 'special',
    });

    expect(result.message).toContain('executada com sucesso');
    expect(mockArena.battleState.monsters[0].hp).toBeGreaterThan(80);
  });

  it('should execute forfeit action and end battle', async () => {
    const result = await service.playerAction(arenaId, {
      player_id: Number(playerId),
      action: 'forfeit',
      target_id: Number(targetId),
    });

    expect(result.message).toContain('desistiu');
    expect(arenaEndService.endBattle).toHaveBeenCalled();
    expect(battleGateway.server.emit).toHaveBeenCalledWith(
      'battleEnded',
      expect.objectContaining({ reason: 'Desistência' })
    );
  });

  it('should return error if not player turn', async () => {
    (turnService.isPlayerTurn as jest.Mock).mockReturnValue(false);
    const result = await service.playerAction(arenaId, {
      player_id: Number(playerId),
      action: 'attack',
      target_id: Number(targetId),
    });

    expect(result.error).toContain('Não é o turno');
  });

  it('should return error for invalid action', async () => {
    const result = await service.playerAction(arenaId, {
      player_id: Number(playerId),
      action: 'invalid',
    });

    expect(result.error).toContain('Ação inválida');
  });
});
