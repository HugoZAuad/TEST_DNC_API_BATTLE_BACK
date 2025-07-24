import { ArenaCreationService } from '../arena-creation.service';

describe('ArenaCreationService', () => {
  let service: ArenaCreationService;

  beforeEach(() => {
    service = new ArenaCreationService();
  });

  it('deve criar uma arena com as propriedades corretas', () => {
    const data = { name: 'Test Arena', max_players: 4 };
    const arena = service.createArena(data);

    expect(arena).toHaveProperty('id');
    expect(arena.name).toBe(data.name);
    expect(arena.maxPlayers).toBe(data.max_players);
    expect(arena.players).toEqual([]);
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
});
