import { Injectable } from '@nestjs/common';
import { ArenaDto } from '../interfaces/dto/arena.dto';
import { PlayerState } from '../../battle/interfaces/interfaces/player-state.interface';
import { MonsterState } from '../../battle/interfaces/interfaces/monster-state.interface';
import { BattleState } from '../../battle/interfaces/interfaces/battle-state.interface';
import { ArenaStateService } from './arena-state.service';

@Injectable()
export class ArenaCreationService {
  private arenas = new Map<string, ArenaDto>();

  constructor(private readonly arenaStateService: ArenaStateService) {}

  /**
   * Cria uma nova arena com os jogadores fornecidos
   */
  createArena(arenaId: string, players: PlayerState[]): ArenaDto {
    const monsters: MonsterState[] = players.map((player) => ({
      playerId: player.playerId,
      name: `Monstro de ${player.username}`,
      hp: 100,
      maxHp: 100,
      attack: player.attack,
      defense: player.defense,
    }));

    const battleState: BattleState = {
      currentTurnPlayerId: players[0].playerId,
      players,
      monsters,
      id: '',
      isBattleActive: false
    };

    const arena: ArenaDto = {
      id: arenaId,
      name: `Arena de ${players.map((p) => p.username).join(' vs ')}`,
      maxPlayers: players.length,
      players,
      battleState,
    };

    this.arenas.set(arenaId, arena);
    this.arenaStateService.openArena(arenaId);

    return arena;
  }

  /**
   * Retorna uma arena pelo ID
   */
  getArena(arenaId: string): ArenaDto | undefined {
    return this.arenas.get(arenaId);
  }

  /**
   * Retorna todas as arenas (opcional)
   */
  getAllArenas(): ArenaDto[] {
    return Array.from(this.arenas.values());
  }

  /**
   * Remove uma arena (opcional)
   */
  removeArena(arenaId: string): void {
    this.arenas.delete(arenaId);
    this.arenaStateService.closeArena(arenaId);
  }
}
