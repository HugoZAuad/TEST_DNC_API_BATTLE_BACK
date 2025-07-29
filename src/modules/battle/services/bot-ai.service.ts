import { Injectable } from '@nestjs/common';
import { BattleState } from '../interfaces/interfaces/battle-state.interface';
import { ArenaCreationService } from '../../arena/services/arena-creation.service';
import { bots } from '../constants/bots';

@Injectable()
export class BotAIService {
  constructor(private readonly arenaCreationService: ArenaCreationService) {}

  async executeBotTurn(
    arenaId: string,
    botId: string,
    targetId: string
  ): Promise<string> {
    const arena = this.arenaCreationService.getArena(arenaId);
    if (!arena || !arena.battleState) {
      return '⚠️ Bot não encontrou arena válida.';
    }

    const battle: BattleState = arena.battleState;

    const botMonster = battle.monsters.find((m) => m.playerId === botId);
    const targetPlayer = battle.players.find((p) => p.playerId === targetId);
    const targetMonster = battle.monsters.find((m) => m.playerId === targetId);

    const botData = bots.find((b) => b.playerId === botId); // ✅ busca na lista

    if (!botMonster || !targetPlayer || !targetMonster || !botData) {
      return '⚠️ Dados do bot ou alvo não encontrados.';
    }

    let log = '';
    const botHpRatio = botMonster.hp / botMonster.maxHp;

    if (botHpRatio < 0.5) {
      botMonster.hp = Math.min(botMonster.hp + 20, botMonster.maxHp);
      log = `✨ ${botData.username} usou ${botData.specialAbility} e se curou!`;
    } else {
      const damage = Math.max(botMonster.attack - targetMonster.defense, 1);
      targetMonster.hp -= damage;
      if (targetMonster.hp <= 0) targetMonster.hp = 0;
      log = `🤖 ${botData.username} atacou ${targetPlayer.username} com ${botMonster.name}, causando ${damage} de dano!`;
    }

    return log;
  }
}
