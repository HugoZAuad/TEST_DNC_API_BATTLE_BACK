import { Test, TestingModule } from '@nestjs/testing';
import { BattleStateService } from '../battle-state.service';
import { ArenaCreationService } from '../../../arena/services/arena-creation.service';
import { ArenaDto } from '../../../arena/interfaces/dto/arena.dto';

describe('BattleStateService', () => {
  let service: BattleStateService;
  let mockArenaService: ArenaCreationService;

  beforeEach(async () => {
    const mockArena: ArenaDto = {
      id: 'arena1',
      name: 'Arena Teste',
      maxPlayers: 2,
      players: [],
      battleState: {
        id: 'battle1',
        turn: 1,
        players: [
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
            specialCooldown: 2,
            defend: true,
          },
        ],
        currentTurnPlayerId: 'player1',
        isBattleActive: true,
        winnerId: undefined,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleStateService,
        {
          provide: ArenaCreationService,
          useValue: {
            getArena: jest.fn().mockReturnValue(mockArena),
          },
        },
      ],
    }).compile();

    service = module.get<BattleStateService>(BattleStateService);
    mockArenaService = module.get<ArenaCreationService>(ArenaCreationService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar o estado atual da batalha', () => {
    const estado = service.getBattleState('arena1');
    expect(estado).toEqual({
      turn: 1,
      players: expect.any(Array),
      isBattleActive: true,
      winner: null,
    });
  });

  it('deve avançar o turno e atualizar cooldown e defesa', () => {
    const resultado = service.advanceTurn('arena1');
    expect(resultado).toEqual({ message: 'Turno avançado', turn: 2 });

    const arena = mockArenaService.getArena('arena1');
    expect(arena).toBeDefined();

    if (arena && arena.battleState) {
      const player = arena.battleState.players[0];
      expect(player.specialCooldown).toBe(1);
      expect(player.defend).toBe(false);
    }
  });
});
