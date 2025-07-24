import { Injectable } from '@nestjs/common';
import { ArenaCreationService } from './arena-creation.service';

@Injectable()
export class ArenaLeaveService {
  constructor(private readonly arenaCreationService: ArenaCreationService) {}

  leaveArena(arenaId: string, data: { player_id: number }) {
    const arena = this.arenaCreationService.getArena(arenaId);
    if (!arena) {
      return { error: 'Arena não encontrada' };
    }

    const playerIndex = arena.players.findIndex(p => p.player_id === data.player_id);
    if (playerIndex === -1) {
      return { error: 'Jogador não está na arena' };
    }

    arena.players.splice(playerIndex, 1);
    return { message: 'Jogador saiu da arena', arena };
  }
}
