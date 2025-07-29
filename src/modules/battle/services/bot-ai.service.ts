import { Injectable } from '@nestjs/common';
import { BattleState } from '../interfaces/interfaces/battle-state.interface';
import { MonsterState } from '../interfaces/interfaces/monster-state.interface';
import { PlayerState } from '../interfaces/interfaces/player-state.interface';
import { ArenaCreationService } from '../../arena/services/arena-creation.service';

@Injectable()
export class BotAIService {
  constructor(private readonly arenaCreationService: ArenaCreationService) {}

  async executeBotTurn(
    arenaId: string,
    botId: number,
    targetId: number
  ): Promise<string> {
    const arena = this.arenaCreationService.getArena(arenaId);
    if (!arena || !arena.battleState) {
      return '⚠️ Bot não encontrou arena válida.';
    }

    const battle: BattleState = arena.battleState;

    const botMonster = battle.monsters.find(
      (m) => Number(m.playerId) === botId
    );
    const targetPlayer = battle.players.find(
      (p) => Number(p.playerId) === targetId
    );
    const targetMonster = battle.monsters.find(
      (m) => Number(m.playerId) === targetId
    );

    if (!botMonster || !targetPlayer || !targetMonster) {
      return '⚠️ Dados do bot ou alvo não encontrados.';
    }

    const damage = Math.max(botMonster.attack - targetMonster.defense, 1);
    targetMonster.hp -= damage;

    if (targetMonster.hp <= 0) {
      targetMonster.hp = 0;
    }

    return `🤖 ${botMonster.name} atacou ${targetPlayer.username} causando ${damage} de dano!`;
  }
}
