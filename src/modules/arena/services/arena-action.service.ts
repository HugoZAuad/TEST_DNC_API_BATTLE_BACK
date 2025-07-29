import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ArenaCreationService } from './arena-creation.service';
import { BattleGateway } from '../../battle/gateway/battle.gateway';
import { BattleTurnService } from '../../battle/services/battle-turn.service';
import { ArenaEndService } from './arena-end.service';
import { ArenaDto } from '../interfaces/dto/arena.dto';
import { BattleState } from '../../battle/interfaces/interfaces/battle-state.interface';
import { PlayerState } from '../../battle/interfaces/interfaces/player-state.interface';
import { MonsterState } from '../../battle/interfaces/interfaces/monster-state.interface';
import { BotAIService } from '../../battle/services/bot-ai.service';

@Injectable()
export class ArenaActionService {
  constructor(
    private readonly arenaCreationService: ArenaCreationService,
    private readonly battleGateway: BattleGateway,
    private readonly turnService: BattleTurnService,
    private readonly arenaEndService: ArenaEndService,
    @Inject(forwardRef(() => BotAIService))
    private readonly botAIService: BotAIService
  ) {}

  async playerAction(
    arenaId: string,
    data: { player_id: number; action: string; target_id?: number }
  ) {
    const arena: ArenaDto | undefined =
      this.arenaCreationService.getArena(arenaId);
    if (!arena || !arena.battleState) {
      return { error: 'Arena ou estado de batalha não encontrado' };
    }

    const battle: BattleState = arena.battleState;
    const playerId = data.player_id.toString();
    const targetId = data.target_id?.toString();

    if (!this.turnService.isPlayerTurn(battle, playerId)) {
      return { error: 'Não é o turno do jogador' };
    }

    const attacker: PlayerState | undefined = battle.players.find(
      (p) => p.playerId === playerId
    );
    const defender: PlayerState | undefined = battle.players.find(
      (p) => p.playerId === targetId
    );

    const attackerMonster: MonsterState | undefined = battle.monsters.find(
      (m) => m.playerId === playerId
    );
    const defenderMonster: MonsterState | undefined = battle.monsters.find(
      (m) => m.playerId === targetId
    );

    if (!attacker || !attackerMonster) {
      return { error: 'Dados do atacante não encontrados' };
    }

    let log = '';

    switch (data.action) {
      case 'attack': {
        if (!defender || !defenderMonster) {
          return { error: 'Dados do defensor não encontrados' };
        }
        const damage = Math.max(
          attackerMonster.attack - defenderMonster.defense,
          1
        );
        defenderMonster.hp -= damage;
        log = `🗡️ ${attacker.username} atacou ${defender.username} com ${attackerMonster.name}, causando ${damage} de dano!`;
        break;
      }

      case 'defend': {
        attackerMonster.defense += 5;
        log = `🛡️ ${attacker.username} aumentou a defesa de ${attackerMonster.name}!`;
        break;
      }

      case 'special': {
        attackerMonster.hp = Math.min(
          attackerMonster.hp + 20,
          attackerMonster.maxHp
        );
        log = `✨ ${attacker.username} usou habilidade especial com ${attackerMonster.name} e se curou!`;
        break;
      }

      case 'forfeit': {
        if (!defender || !defenderMonster) {
          return {
            error: 'Dados do defensor não encontrados para declarar vencedor',
          };
        }
        await this.arenaEndService.endBattle(arenaId, {
          winner: {
            player_id: Number(targetId),
            monster: defenderMonster.name,
          },
        });
        this.battleGateway.server.to(arenaId).emit('battleEnded', {
          winner: defender.username,
          reason: 'Desistência',
        });
        return { message: 'Jogador desistiu da batalha' };
      }

      default:
        return { error: 'Ação inválida' };
    }

    this.battleGateway.server.to(arenaId).emit('battleTurnEnded', {
      actions: [log],
      currentPlayer: playerId,
    });

    if (defenderMonster && defenderMonster.hp <= 0) {
      await this.arenaEndService.endBattle(arenaId, {
        winner: { player_id: Number(playerId), monster: attackerMonster.name },
      });
      this.battleGateway.server.to(arenaId).emit('battleEnded', {
        winner: attacker.username,
        reason: 'HP zerado',
      });
      return { message: 'Batalha encerrada' };
    }

    const updatedBattle = this.turnService.switchTurn(battle);

    this.battleGateway.server.to(arenaId).emit('battleUpdate', updatedBattle);

    const nextPlayerId = updatedBattle.currentTurnPlayerId;

    const botMonster = updatedBattle.monsters.find(
      (m) => m.playerId === nextPlayerId
    );

    if (botMonster) {
      const target = updatedBattle.players.find(
        (p) => p.playerId !== nextPlayerId
      );

      if (target) {
        const botLog = await this.botAIService.executeBotTurn(
          arenaId,
          nextPlayerId.toString(),
          target.playerId.toString()
        );

        this.battleGateway.server.to(arenaId).emit('battleTurnEnded', {
          actions: [botLog],
          currentPlayer: nextPlayerId.toString(),
        });
      }
    }

    return { message: `Ação ${data.action} executada com sucesso` };
  }
}
