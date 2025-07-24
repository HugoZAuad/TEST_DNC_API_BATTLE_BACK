import { Injectable } from '@nestjs/common';
import { ArenaCreationService } from './arena-creation.service';
import { ArenaDto } from '../interfaces/dto/arena.dto';

@Injectable()
export class ArenaStartService {
  constructor(private readonly arenaCreationService: ArenaCreationService) {}

  startBattle(arenaId: string) {
    const arena: ArenaDto | undefined = this.arenaCreationService.getArena(arenaId);
    if (!arena) {
      return { error: 'Arena não encontrada' };
    }

    if (arena.players.length < 2) {
      return { error: 'Número insuficiente de jogadores para iniciar a batalha' };
    }

    // Inicializar estado da batalha
    arena.battleState = {
      turn: 1,
      players: arena.players.map(p => ({
        player_id: p.player_id,
        monster: p.monster_id,
        hp: 100,
        defend: false,
        specialCooldown: 0,
      })),
      isBattleActive: true,
    };

    return {
      message: 'Batalha iniciada',
      turn: arena.battleState.turn,
      battle_state: arena.battleState,
    };
  }
}
