import { ArenaEndService } from '../arena-end.service';
import { ArenaCreationService } from '../arena-creation.service';

describe('ArenaEndService', () => {
  let service: ArenaEndService;
  let mockArenaCreationService: any;

  beforeEach(() => {
    mockArenaCreationService = {
      getArena: jest.fn(),
    };
    service = new ArenaEndService(mockArenaCreationService);
  });

  it('deve retornar erro se a arena não for encontrada', () => {
    mockArenaCreationService.getArena.mockReturnValue(undefined);
    const result = service.endBattle('arena1', { winner: { player_id: 1, monster: 'monster1' } });
    expect(result).toEqual({ error: 'Arena não encontrada' });
  });

  it('deve retornar erro se a batalha não estiver ativa', () => {
    const arena = { battleState: { isBattleActive: false } };
    mockArenaCreationService.getArena.mockReturnValue(arena);
    const result = service.endBattle('arena1', { winner: { player_id: 1, monster: 'monster1' } });
    expect(result).toEqual({ error: 'Batalha não está ativa' });
  });

  it('deve finalizar a batalha e definir o vencedor', () => {
    const arena = { battleState: { isBattleActive: true, winner: undefined } };
    mockArenaCreationService.getArena.mockReturnValue(arena);
    const winner = { player_id: 1, monster: 'monster1' };
    const result = service.endBattle('arena1', { winner });
    expect(result).toEqual({ message: 'Batalha finalizada', winner });
    expect(arena.battleState.isBattleActive).toBe(false);
    expect(arena.battleState.winner).toEqual(winner);
  });
});
