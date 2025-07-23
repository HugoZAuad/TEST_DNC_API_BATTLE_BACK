import { PlayerState } from './player-state.interface';

export interface BattleState {
  players: PlayerState[];
  currentTurnPlayerId: string;
  isBattleActive: boolean;
}
