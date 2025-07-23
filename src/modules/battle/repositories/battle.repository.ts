import { Injectable } from '@nestjs/common';
import { PlayerState } from '../interfaces/interfaces/player-state.interface';
import { BattleState } from '../interfaces/interfaces/battle-state.interface';
import { bots } from '../constants/bots';

@Injectable()
export class BattleRepository {
  private battles: Map<string, BattleState> = new Map();

  getBots(): PlayerState[] {
    return bots;
  }

  createBattle(battleId: string, players: PlayerState[]) {
    this.battles.set(battleId, {
      players,
      currentTurnPlayerId: this.getFastestPlayer(players).playerId,
      isBattleActive: true,
    });
  }

  getBattle(battleId: string): BattleState | undefined {
    return this.battles.get(battleId);
  }

  updateBattle(battleId: string, battleState: BattleState) {
    this.battles.set(battleId, battleState);
  }

  deleteBattle(battleId: string) {
    this.battles.delete(battleId);
  }

  private getFastestPlayer(players: PlayerState[]): PlayerState {
    return players.reduce((prev, current) => (prev.speed > current.speed ? prev : current));
  }

  getBattleByPlayerId(playerId: string): BattleState | undefined {
    for (const battle of this.battles.values()) {
      if (battle.players.some(p => p.playerId === playerId)) {
        return battle;
      }
    }
    return undefined;
  }
}
