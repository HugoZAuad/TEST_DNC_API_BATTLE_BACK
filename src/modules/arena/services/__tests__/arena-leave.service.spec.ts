import { ArenaLeaveService } from '../arena-leave.service';
import { ArenaCreationService } from '../arena-creation.service';

describe('ArenaLeaveService', () => {
  let service: ArenaLeaveService;
  let mockArenaCreationService: any;

  beforeEach(() => {
    mockArenaCreationService = {
      getArena: jest.fn(),
    };
    service = new ArenaLeaveService(mockArenaCreationService);
  });

  it('deve retornar erro se a arena não for encontrada', () => {
    mockArenaCreationService.getArena.mockReturnValue(undefined);
    const result = service.leaveArena('arena1', { player_id: 1 });
    expect(result).toEqual({ error: 'Arena não encontrada' });
  });

  it('deve retornar erro se o jogador não estiver na arena', () => {
    const arena = { players: [{ player_id: 2 }] };
    mockArenaCreationService.getArena.mockReturnValue(arena);
    const result = service.leaveArena('arena1', { player_id: 1 });
    expect(result).toEqual({ error: 'Jogador não está na arena' });
  });

  it('deve remover jogador da arena', () => {
    const arena = { players: [{ player_id: 1 }, { player_id: 2 }] };
    mockArenaCreationService.getArena.mockReturnValue(arena);
    const result = service.leaveArena('arena1', { player_id: 1 });
    expect(result).toEqual({ message: 'Jogador saiu da arena', arena });
    expect(arena.players.length).toBe(1);
    expect(arena.players.find(p => p.player_id === 1)).toBeUndefined();
  });
});
