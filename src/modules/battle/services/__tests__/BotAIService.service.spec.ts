import { BotAIService } from '../bot-ai.service';
import { ArenaCreationService } from '../../../arena/services/arena-creation.service';
import { BattleState } from '../../interfaces/interfaces/battle-state.interface';

describe('BotAIService', () => {
  let service: BotAIService;
  let arenaCreationService: ArenaCreationService;

  const arenaId = 'arena1';
  const botId = 'bot123';
  const targetId = 'player1';

  const mockBattleState: BattleState = {
    players: [
      {
        playerId: targetId,
        username: 'Player One',
        hp: 100,
        attack: 10,
        defense: 5,
        speed: 10,
        specialAbility: 'None',
        isBot: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    monsters: [
      {
        playerId: botId,
        name: 'Botzilla',
        hp: 40,
        maxHp: 100,
        attack: 20,
        defense: 5,
      },
      {
        playerId: targetId,
        name: 'Dragon',
        hp: 50,
        maxHp: 100,
        attack: 15,
        defense: 10,
      },
    ],
    currentTurnPlayerId: botId,
    id: '',
    isBattleActive: false
  };

  beforeEach(() => {
    arenaCreationService = {
      getArena: jest.fn().mockReturnValue({ battleState: mockBattleState }),
    } as any;

    service = new BotAIService(arenaCreationService);
  });

  it('should heal bot if HP is below 50%', async () => {
    mockBattleState.monsters[0].hp = 40;
    const log = await service.executeBotTurn(arenaId, botId, targetId);
    expect(log).toContain('se curou');
    expect(mockBattleState.monsters[0].hp).toBeGreaterThan(40);
  });

  it('should attack target if bot HP is above 50%', async () => {
    mockBattleState.monsters[0].hp = 80;
    const log = await service.executeBotTurn(arenaId, botId, targetId);
    expect(log).toContain('atacou');
    expect(mockBattleState.monsters[1].hp).toBeLessThan(50);
  });

  it('should return warning if arena is not found', async () => {
    (arenaCreationService.getArena as jest.Mock).mockReturnValue(undefined);
    const log = await service.executeBotTurn('invalidArena', botId, targetId);
    expect(log).toContain('não encontrou arena');
  });

  it('should return warning if bot or target data is missing', async () => {
    mockBattleState.monsters = []; // remove monsters
    const log = await service.executeBotTurn(arenaId, botId, targetId);
    expect(log).toContain('não encontrados');
  });
});
