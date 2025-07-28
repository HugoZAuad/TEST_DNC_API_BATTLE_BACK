import { ArenaCreationService } from '../arena-creation.service';
import { ArenaStateService } from '../arena-state.service';

describe('ArenaCreationService', () => {
  let service: ArenaCreationService;
  let mockArenaStateService: jest.Mocked<ArenaStateService>;

  beforeEach(() => {
    mockArenaStateService = {
      openArena: jest.fn(),
    } as unknown as jest.Mocked<ArenaStateService>;

    service = new ArenaCreationService(mockArenaStateService);
  });

  it('deve criar uma arena com as propriedades corretas', () => {
    const data = { name: 'Test Arena', max_players: 4 };
    const arena = service.createArena(data);

    expect(arena).toHaveProperty('id');
    expect(arena.name).toBe(data.name);
    expect(arena.maxPlayers).toBe(data.max_players);
    expect(arena.players).toEqual([]);
    expect(mockArenaStateService.openArena).toHaveBeenCalledWith(arena.id);
  });

  it('deve recuperar uma arena pelo id', () => {
    const data = { name: 'Test Arena', max_players: 4 };
    const arena = service.createArena(data);

    const foundArena = service.getArena(arena.id);
    expect(foundArena).toEqual(arena);
  });

  it('deve retornar undefined para arena inexistente', () => {
    const foundArena = service.getArena('non-existing-id');
    expect(foundArena).toBeUndefined();
  });

  it('deve retornar todas as arenas criadas', () => {
    service.getAllArenas().clear();

    const data1 = { name: 'Arena 1', max_players: 2 };
    const data2 = { name: 'Arena 2', max_players: 4 };

    const arena1 = service.createArena(data1);
    const arena2 = service.createArena(data2);

    const allArenas = service.getAllArenas();

    expect(allArenas.size).toBe(2);
    expect(allArenas.get(arena1.id)).toEqual(arena1);
    expect(allArenas.get(arena2.id)).toEqual(arena2);
  });
});
