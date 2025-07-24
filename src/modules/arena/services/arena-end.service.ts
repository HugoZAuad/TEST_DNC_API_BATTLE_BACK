import { Injectable } from '@nestjs/common';
import { ArenaCreationService } from './arena-creation.service';
import { ArenaDto } from '../interfaces/dto/arena.dto';

@Injectable()
export class ArenaEndService {
  constructor(private readonly arenaCreationService: ArenaCreationService) {}

  endBattle(arenaId: string, data: { winner: { player_id: number; monster: string } }) {
    const arena: ArenaDto | undefined = this.arenaCreationService.getArena(arenaId);
    if (!arena) {
      return { error: 'Arena não encontrada' };
    }

    if (!arena.battleState || !arena.battleState.isBattleActive) {
      return { error: 'Batalha não está ativa' };
    }

    arena.battleState.isBattleActive = false;
    arena.battleState.winner = data.winner;

    return { message: 'Batalha finalizada', winner: data.winner };
  }
}
