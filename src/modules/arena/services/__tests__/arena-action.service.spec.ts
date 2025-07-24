import { ArenaActionService } from '../arena-action.service';

describe('ArenaActionService', () => {
  let service: ArenaActionService;
  let mockArenaCreationService: any;
  let mockBattleGateway: any;

  beforeEach(() => {
    mockArenaCreationService = {
      getArena: jest.fn(),
    };
    mockBattleGateway = {
      getSocketByPlayerId: jest.fn(),
      handleAttack: jest.fn(),
      server: {
        emit: jest.fn(),
      },
    };
    service = new ArenaActionService(mockArenaCreationService, mockBattleGateway);
  });

  it('deve retornar erro se a arena não for encontrada', async () => {
    mockArenaCreationService.getArena.mockReturnValue(undefined);
    const result = await service.playerAction('arena1', { player_id: 1, action: 'attack', target_id: '2' });
    expect(result).toEqual({ error: 'Arena não encontrada' });
  });

  it('deve retornar erro se o socket não for encontrado no ataque', async () => {
    mockArenaCreationService.getArena.mockReturnValue({});
    mockBattleGateway.getSocketByPlayerId.mockReturnValue(undefined);
    const result = await service.playerAction('arena1', { player_id: 1, action: 'attack', target_id: '2' });
    expect(result).toEqual({ error: 'Socket do jogador não encontrado' });
  });

  it('deve processar a ação de ataque', async () => {
    mockArenaCreationService.getArena.mockReturnValue({});
    const mockSocket = {};
    mockBattleGateway.getSocketByPlayerId.mockReturnValue(mockSocket);
    mockBattleGateway.handleAttack.mockResolvedValue(undefined);

    const result = await service.playerAction('arena1', { player_id: 1, action: 'attack', target_id: '2' });
    expect(mockBattleGateway.handleAttack).toHaveBeenCalledWith({ playerId: '1', targetId: '2' }, mockSocket);
    expect(result).toEqual({ message: 'Ação attack processada para jogador 1 na arena arena1' });
  });

  it('deve processar a ação de defesa', async () => {
    mockArenaCreationService.getArena.mockReturnValue({});
    const result = await service.playerAction('arena1', { player_id: 1, action: 'defend' });
    expect(mockBattleGateway.server.emit).toHaveBeenCalledWith('defend', { playerId: 1, arenaId: 'arena1' });
    expect(result).toEqual({ message: 'Ação defend processada para jogador 1 na arena arena1' });
  });

  it('deve processar a ação especial', async () => {
    mockArenaCreationService.getArena.mockReturnValue({});
    const result = await service.playerAction('arena1', { player_id: 1, action: 'special' });
    expect(mockBattleGateway.server.emit).toHaveBeenCalledWith('special', { playerId: 1, arenaId: 'arena1' });
    expect(result).toEqual({ message: 'Ação special processada para jogador 1 na arena arena1' });
  });

  it('deve processar a ação de desistência', async () => {
    mockArenaCreationService.getArena.mockReturnValue({});
    const result = await service.playerAction('arena1', { player_id: 1, action: 'forfeit' });
    expect(mockBattleGateway.server.emit).toHaveBeenCalledWith('forfeit', { playerId: 1, arenaId: 'arena1' });
    expect(result).toEqual({ message: 'Ação forfeit processada para jogador 1 na arena arena1' });
  });

  it('deve retornar erro para ação inválida', async () => {
    mockArenaCreationService.getArena.mockReturnValue({});
    const result = await service.playerAction('arena1', { player_id: 1, action: 'invalid' });
    expect(result).toEqual({ error: 'Ação inválida' });
  });
});
