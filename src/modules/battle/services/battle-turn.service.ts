import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '../../player/repositories/player.repository';
import { MonsterRepository } from '../../monster/repositories/monster.repository';
import { BattleState } from '../interfaces/interfaces/battle-state.interface';

@Injectable()
export class BattleTurnService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly monsterRepository: MonsterRepository,
  ) {}

  isPlayerTurn(battleState: BattleState, playerId: string): boolean {
    return battleState.currentTurnPlayerId === playerId;
  }

  switchTurn(battleState: BattleState): BattleState {
    const currentPlayerIndex = battleState.players.findIndex(
      (p) => p.playerId === battleState.currentTurnPlayerId,
    );
    const nextPlayerIndex = (currentPlayerIndex + 1) % battleState.players.length;
    battleState.currentTurnPlayerId = battleState.players[nextPlayerIndex].playerId;
    return battleState;
  }

  async handleAttack(attackerId: number, targetId: number): Promise<void> {
    const attacker = await this.getEntity(attackerId);
    const target = await this.getEntity(targetId);

    const damage = attacker.attack || 10;
    target.hp = Math.max(0, target.hp - damage);

    await this.saveEntity(targetId, target);
  }

  async handleDefend(entityId: number): Promise<void> {
    const entity = await this.getEntity(entityId);
    const healAmount = 5;

    entity.hp = Math.min(entity.hp + healAmount, entity.maxHp || entity.hp);
    await this.saveEntity(entityId, entity);
  }

  async handleSpecial(attackerId: number, targetId: number): Promise<void> {
    const attacker = await this.getEntity(attackerId);
    const target = await this.getEntity(targetId);

    const specialDamage = (attacker.attack || 10) * 2;
    target.hp = Math.max(0, target.hp - specialDamage);

    await this.saveEntity(targetId, target);
  }

  private async getEntity(id: number): Promise<any> {
    if (id >= 1000) {
      return await this.monsterRepository.findById(id);
    } else {
      return await this.playerRepository.findById(id);
    }
  }

  private async saveEntity(id: number, data: any): Promise<void> {
    if (id >= 1000) {
      await this.monsterRepository.update(id, data);
    } else {
      await this.playerRepository.update(id, data);
    }
  }
}
