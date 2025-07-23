import { BattleTurnService } from '../battle-turn.service';

describe('BattleTurnService', () => {
  let service: BattleTurnService;

  beforeEach(() => {
    service = new BattleTurnService();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar true se for o turno do jogador', () => {
    const battleState = {
      currentTurnPlayerId: 'player1',
      players: [
        { playerId: 'player1', hp: 100, attack: 10, defense: 5, speed: 7, specialAbility: 'None', isBot: false, createdAt: new Date(), updatedAt: new Date() },
        { playerId: 'player2', hp: 100, attack: 10, defense: 5, speed: 7, specialAbility: 'None', isBot: false, createdAt: new Date(), updatedAt: new Date() }
      ],
      isBattleActive: true,
    };
    const result = service.isPlayerTurn(battleState, 'player1');
    expect(result).toBe(true);
  });

  it('deve retornar false se não for o turno do jogador', () => {
    const battleState = {
      currentTurnPlayerId: 'player1',
      players: [
        { playerId: 'player1', hp: 100, attack: 10, defense: 5, speed: 7, specialAbility: 'None', isBot: false, createdAt: new Date(), updatedAt: new Date() },
        { playerId: 'player2', hp: 100, attack: 10, defense: 5, speed: 7, specialAbility: 'None', isBot: true, createdAt: new Date(), updatedAt: new Date() }
      ],
      isBattleActive: true,
    };
    const result = service.isPlayerTurn(battleState, 'player2');
    expect(result).toBe(false);
  });

  it('deve alternar o turno para o próximo jogador', () => {
    const battleState = {
      currentTurnPlayerId: 'player1',
      players: [
        { playerId: 'player1', hp: 100, attack: 10, defense: 5, speed: 7, specialAbility: 'None', isBot: false, createdAt: new Date(), updatedAt: new Date() },
        { playerId: 'player2', hp: 100, attack: 10, defense: 5, speed: 7, specialAbility: 'None', isBot: true, createdAt: new Date(), updatedAt: new Date() }
      ],
      isBattleActive: true,
    };
    const newState = service.switchTurn(battleState);
    expect(newState.currentTurnPlayerId).toBe('player2');
  });

  it('deve alternar o turno para o primeiro jogador após o último', () => {
    const battleState = {
      currentTurnPlayerId: 'player2',
      players: [
        { playerId: 'player1', hp: 100, attack: 10, defense: 5, speed: 7, specialAbility: 'None', isBot: false, createdAt: new Date(), updatedAt: new Date() },
        { playerId: 'player2', hp: 100, attack: 10, defense: 5, speed: 7, specialAbility: 'None', isBot: true, createdAt: new Date(), updatedAt: new Date() }
      ],
      isBattleActive: true,
    };
    const newState = service.switchTurn(battleState);
    expect(newState.currentTurnPlayerId).toBe('player1');
  });
});
