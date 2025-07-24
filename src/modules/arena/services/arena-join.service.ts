import { Injectable } from '@nestjs/common';
import { ArenaCreationService } from './arena-creation.service';
import { ArenaStateService } from './arena-state.service';

@Injectable()
export class ArenaJoinService {
  constructor(
    private readonly arenaCreationService: ArenaCreationService,
    private readonly arenaStateService: ArenaStateService,
  ) {}

  joinArena(arenaId: string, data: { player_id: number; monster_id: number }) {
    if (!this.arenaStateService.isArenaOpen(arenaId)) {
      return { error: 'Arena fechada para novas entradas' };
    }

    const arena = this.arenaCreationService.getArena(arenaId);
    if (!arena) {
      return { error: 'Arena não encontrada' };
    }

    if (arena.players.length >= arena.maxPlayers) {
      return { error: 'Arena cheia' };
    }

    // Verificar se jogador já está na arena
    const existingPlayer = arena.players.find(p => p.player_id === data.player_id);
    if (existingPlayer) {
      return { error: 'Jogador já está na arena' };
    }

    arena.players.push({ player_id: data.player_id, monster_id: data.monster_id });
    return { message: 'Jogador entrou na arena', arena };
  }
}
