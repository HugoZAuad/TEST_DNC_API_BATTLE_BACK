import { PlayerState } from './player-state.interface';
import { MonsterState } from './monster-state.interface';

export interface BattleState {
  id: string;
  players: PlayerState[];
  monsters: MonsterState[];
  currentTurnPlayerId: string;
  isBattleActive: boolean;
  winnerId?: string;
}
