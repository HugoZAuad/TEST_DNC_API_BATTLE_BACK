import { BattleTurnService } from '../battle-turn.service';
import { BattleState } from '../../interfaces/interfaces/battle-state.interface';
import { PlayerState } from '../../interfaces/interfaces/player-state.interface';

describe('BattleTurnService', () => {
  let service: BattleTurnService;

  beforeEach(() => {
    service = new BattleTurnService();
  });

  const mockPlayers: PlayerState[] = [
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
    },
    {
      playerId: 'player2',
      hp: 100,
      attack: 10,
      defense: 5,
      speed: 7,
      specialAbility: 'None',
      isBot: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar true se for o turno do jogador', () => {
    const battleState: BattleState = {
      id: 'battle1',
      players: mockPlayers,
      currentTurnPlayerId: 'player1',
      isBattleActive: true,
    };
    expect(service.isPlayerTurn(battleState, 'player1')).toBe(true);
  });

  it('deve retornar false se não for o turno do jogador', () => {
    const battleState: BattleState = {
      id: 'battle1',
      players: mockPlayers,
      currentTurnPlayerId: 'player1',
      isBattleActive: true,
    };
    expect(service.isPlayerTurn(battleState, 'player2')).toBe(false);
  });

  it('deve alternar o turno para o próximo jogador', () => {
    const battleState: BattleState = {
      id: 'battle1',
      players: mockPlayers,
      currentTurnPlayerId: 'player1',
      isBattleActive: true,
    };
    const newState = service.switchTurn(battleState);
    expect(newState.currentTurnPlayerId).toBe('player2');
  });

  it('deve alternar o turno para o primeiro jogador após o último', () => {
    const battleState: BattleState = {
      id: 'battle1',
      players: mockPlayers,
      currentTurnPlayerId: 'player2',
      isBattleActive: true,
    };
    const newState = service.switchTurn(battleState);
    expect(newState.currentTurnPlayerId).toBe('player1');
  });
});
