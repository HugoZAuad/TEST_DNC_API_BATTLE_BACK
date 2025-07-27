import { Injectable } from '@nestjs/common';
import { ArenaCreationService } from '../../arena/services/arena-creation.service';
import { ArenaDto } from '../../arena/interfaces/dto/arena.dto';

@Injectable()
export class BattleStateService {
  constructor(private readonly arenaCreationService: ArenaCreationService) {}

  getState(arenaId: string) {
    const arena: ArenaDto | undefined = this.arenaCreationService.getArena(arenaId);
    if (!arena) {
      return { error: 'Arena não encontrada' };
    }

    if (!arena.battleState || !arena.battleState.isBattleActive) {
      return { error: 'Batalha não está ativa' };
    }

    return {
      turn: arena.battleState.turn,
      players: arena.battleState.players,
      isBattleActive: arena.battleState.isBattleActive,
      winner: arena.battleState.winner || null,
    };
  }

  getBattleState(arenaId: string) {
    return this.getState(arenaId);
  }

  advanceTurn(arenaId: string) {
    const arena = this.arenaCreationService.getArena(arenaId);
    if (!arena || !arena.battleState) return;

    arena.battleState.turn += 1;

    for (const player of arena.battleState.players) {
      if (player.specialCooldown > 0) {
        player.specialCooldown -= 1;
      }
      player.defend = false;
    }

    return { message: 'Turno avançado', turn: arena.battleState.turn };
  }
}
