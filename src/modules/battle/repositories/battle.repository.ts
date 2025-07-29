import { Injectable } from '@nestjs/common';
import { PlayerState } from '../interfaces/interfaces/player-state.interface';
import { BattleState } from '../interfaces/interfaces/battle-state.interface';
import { MonsterState } from '../interfaces/interfaces/monster-state.interface';
import { bots } from '../constants/bots';

@Injectable()
export class BattleRepository {
  private battles: Map<string, BattleState> = new Map();

  getBots(): PlayerState[] {
    return bots;
  }

  createBattle(battleId: string, players: PlayerState[]) {
    const monsters: MonsterState[] = players.map(player => ({
      playerId: player.playerId,
      name: `Monstro de ${player.username}`,
      hp: player.hp,
      maxHp: player.hp,
      attack: player.attack,
      defense: player.defense,
    }));

    const battleState: BattleState = {
      id: battleId,
      players,
      monsters,
      currentTurnPlayerId: this.getFastestPlayer(players).playerId,
      isBattleActive: true,
    };

    this.battles.set(battleId, battleState);
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

  getBattleByPlayerId(playerId: string): BattleState | undefined {
    for (const battle of this.battles.values()) {
      if (battle.players.some(p => p.playerId === playerId)) {
        return battle;
      }
    }
    return undefined;
  }

  endBattle(winnerId: string, loserId: string): void {
    const battle =
      this.getBattleByPlayerId(winnerId) || this.getBattleByPlayerId(loserId);
    if (battle) {
      this.deleteBattle(battle.id);
    }
  }

  private getFastestPlayer(players: PlayerState[]): PlayerState {
    return players.reduce((prev, current) =>
      prev.speed > current.speed ? prev : current,
    );
  }
}
