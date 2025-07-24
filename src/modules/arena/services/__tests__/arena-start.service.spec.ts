import { ArenaStartService } from '../arena-start.service';
import { ArenaCreationService } from '../arena-creation.service';

describe('ArenaStartService', () => {
  let service: ArenaStartService;
  let mockArenaCreationService: any;

  beforeEach(() => {
    mockArenaCreationService = {
      getArena: jest.fn(),
    };
    service = new ArenaStartService(mockArenaCreationService);
  });

  it('deve retornar erro se a arena não for encontrada', () => {
    mockArenaCreationService.getArena.mockReturnValue(undefined);
    const result = service.startBattle('arena1');
    expect(result).toEqual({ error: 'Arena não encontrada' });
  });

  it('deve retornar erro se não houver jogadores suficientes', () => {
    const arena = { players: [] };
    mockArenaCreationService.getArena.mockReturnValue(arena);
    const result = service.startBattle('arena1');
    expect(result).toEqual({ error: 'Número insuficiente de jogadores para iniciar a batalha' });
  });

  it('deve inicializar o estado da batalha e retornar mensagem de sucesso', () => {
    const arena = {
      players: [
        { player_id: 1, monster_id: 'monster1' },
        { player_id: 2, monster_id: 'monster2' },
      ],
    };
    mockArenaCreationService.getArena.mockReturnValue(arena);
    const result = service.startBattle('arena1');
    expect(result).toHaveProperty('message', 'Batalha iniciada');
    expect(result).toHaveProperty('turn', 1);
    expect(result.battle_state).toHaveProperty('isBattleActive', true);
    expect(result.battle_state.players.length).toBe(2);
  });
});
