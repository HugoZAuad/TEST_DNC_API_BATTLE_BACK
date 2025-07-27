import { PlayerState } from './player-state.interface';

export interface BattleState {
  id: string;
  players: PlayerState[];
  currentTurnPlayerId: string;
  isBattleActive: boolean;
  winnerId?: string
}
