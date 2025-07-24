import { Injectable } from '@nestjs/common';
import { ArenaCreationService } from './arena-creation.service';

@Injectable()
export class ArenaJoinService {
  constructor(private readonly arenaCreationService: ArenaCreationService) {}

  joinArena(arenaId: string, data: { player_id: number; monster_id: number }) {
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
