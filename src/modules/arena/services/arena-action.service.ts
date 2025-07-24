import { Injectable } from '@nestjs/common';
import { ArenaCreationService } from './arena-creation.service';
import { BattleGateway } from '../../battle/gateway/battle.gateway';

@Injectable()
export class ArenaActionService {
  constructor(
    private readonly arenaCreationService: ArenaCreationService,
    private readonly battleGateway: BattleGateway,
  ) {}

  async playerAction(arenaId: string, data: { player_id: number; action: string; target_id?: string }) {
    const arena = this.arenaCreationService.getArena(arenaId);
    if (!arena) {
      return { error: 'Arena não encontrada' };
    }

    // Delegar a ação para o BattleGateway conforme o tipo de ação
    switch (data.action) {
      case 'attack':
        // ataque - defesa
        const socket = this.battleGateway.getSocketByPlayerId(data.player_id.toString());
        if (!socket) {
          return { error: 'Socket do jogador não encontrado' };
        }
        await this.battleGateway.handleAttack({ playerId: data.player_id.toString(), targetId: data.target_id! } as any, socket);
        break;
      case 'defend':
        // Defesa: jogador não pode atacar no próximo turno
        this.battleGateway.server.emit('defend', { playerId: data.player_id, arenaId });
        break;
      case 'special':
        // Special: adiciona 25% ao ataque, só pode usar a cada 3 turnos
        this.battleGateway.server.emit('special', { playerId: data.player_id, arenaId });
        break;
      case 'forfeit':
        this.battleGateway.server.emit('forfeit', { playerId: data.player_id, arenaId });
        break;
      default:
        return { error: 'Ação inválida' };
    }

    return { message: `Ação ${data.action} processada para jogador ${data.player_id} na arena ${arenaId}` };
  }
}
