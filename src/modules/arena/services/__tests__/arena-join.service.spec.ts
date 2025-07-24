import { ArenaJoinService } from '../arena-join.service';
import { ArenaCreationService } from '../arena-creation.service';

describe('ArenaJoinService', () => {
  let service: ArenaJoinService;
  let mockArenaCreationService: any;

  beforeEach(() => {
    mockArenaCreationService = {
      getArena: jest.fn(),
    };
    service = new ArenaJoinService(mockArenaCreationService);
  });

  it('deve retornar erro se a arena não for encontrada', () => {
    mockArenaCreationService.getArena.mockReturnValue(undefined);
    const result = service.joinArena('arena1', { player_id: 1, monster_id: 1 });
    expect(result).toEqual({ error: 'Arena não encontrada' });
  });

  it('deve retornar erro se a arena estiver cheia', () => {
    const arena = { players: [{ player_id: 1 }], maxPlayers: 1 };
    mockArenaCreationService.getArena.mockReturnValue(arena);
    const result = service.joinArena('arena1', { player_id: 2, monster_id: 1 });
    expect(result).toEqual({ error: 'Arena cheia' });
  });

  it('deve retornar erro se o jogador já estiver na arena', () => {
    const arena = { players: [{ player_id: 1 }], maxPlayers: 2 };
    mockArenaCreationService.getArena.mockReturnValue(arena);
    const result = service.joinArena('arena1', { player_id: 1, monster_id: 1 });
    expect(result).toEqual({ error: 'Jogador já está na arena' });
  });

  it('deve adicionar jogador na arena', () => {
    const arena = { players: [], maxPlayers: 2 };
    mockArenaCreationService.getArena.mockReturnValue(arena);
    const result = service.joinArena('arena1', { player_id: 1, monster_id: 1 });
    expect(result).toEqual({ message: 'Jogador entrou na arena', arena });
    expect(arena.players.length).toBe(1);
    expect(arena.players[0]).toEqual({ player_id: 1, monster_id: 1 });
  });
});
