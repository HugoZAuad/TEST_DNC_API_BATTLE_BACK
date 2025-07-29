import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BattleTurnService } from './battle-turn.service';
import { BattleEndService } from './battle-end.service';
import { MonsterFindByIdService } from '../../monster/services/monster-find-by-id.service';
import { PlayerFindByIdService } from '../../player/services/player-find-by-id.service';

type BotActionType = 'attack' | 'defend' | 'special';

@Injectable()
export class BotAIService {
  constructor(
    private readonly battleTurnService: BattleTurnService,
    private readonly battleEndService: BattleEndService,
    @Inject(forwardRef(() => MonsterFindByIdService))
    private readonly monsterFindByIdService: MonsterFindByIdService,
    @Inject(forwardRef(() => PlayerFindByIdService))
    private readonly playerFindByIdService: PlayerFindByIdService,
  ) {}

  private decideSmartBotAction(botHp: number, botMaxHp: number, enemyHp: number): BotActionType {
    const botHpRatio = botHp / botMaxHp;
    if (botHpRatio < 0.3) return 'defend';
    if (botHpRatio > 0.7 && enemyHp < botHp) return 'special';
    return 'attack';
  }

  private async getEntityStats(entityId: number): Promise<{ hp: number; maxHp: number }> {
    const isBot = entityId >= 1000;

    const entity = isBot
      ? await this.monsterFindByIdService.findById(entityId)
      : await this.playerFindByIdService.findById(entityId);

    if (!entity) {
      throw new Error(`Entidade com ID ${entityId} não encontrada`);
    }

    if ('hp' in entity) {
      return { hp: entity.hp, maxHp: entity.hp }; // ajuste se tiver maxHp separado
    }

    throw new Error(`Entidade com ID ${entityId} não possui dados de combate`);
  }

  async executeBotTurn(botId: number, targetId: number): Promise<void> {
    const botStats = await this.getEntityStats(botId);
    const targetStats = await this.getEntityStats(targetId);

    const action = this.decideSmartBotAction(botStats.hp, botStats.maxHp, targetStats.hp);

    switch (action) {
      case 'attack':
        await this.battleTurnService.handleAttack(botId, targetId);
        break;
      case 'defend':
        await this.battleTurnService.handleDefend(botId);
        break;
      case 'special':
        await this.battleTurnService.handleSpecial(botId, targetId);
        break;
    }

    const updatedTarget = await this.getEntityStats(targetId);
    if (updatedTarget.hp <= 0) {
      await this.battleEndService.handleBattleEnd(String(botId), String(targetId));
      console.log(`Bot ${botId} venceu a batalha.`);
      return;
    }

    const updatedBot = await this.getEntityStats(botId);
    if (updatedBot.hp <= 0) {
      await this.battleEndService.handleBattleEnd(String(targetId), String(botId));
      console.log(`Jogador ${targetId} venceu a batalha.`);
      return;
    }

    console.log(`Bot ${botId} executou ação: ${action}`);
  }
}
