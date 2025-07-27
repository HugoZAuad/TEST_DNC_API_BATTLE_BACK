import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ArenaDto } from '../interfaces/dto/arena.dto';
import { ArenaStateService } from './arena-state.service';

@Injectable()
export class ArenaCreationService {
  private arenas: Map<string, ArenaDto> = new Map();

  constructor(
    @Inject(forwardRef(() => ArenaStateService))
    private readonly arenaStateService: ArenaStateService,
  ) {}

  createArena(data: { name: string; max_players: number }): ArenaDto {
    const id = Date.now().toString();
    const arena: ArenaDto = {
      id,
      name: data.name,
      maxPlayers: data.max_players,
      players: [],
    };
    this.arenas.set(id, arena);
    this.arenaStateService.openArena(id);
    return arena;
  }

  getArena(id: string): ArenaDto | undefined {
    return this.arenas.get(id);
  }

  getAllArenas(): Map<string, ArenaDto> {
    return this.arenas;
  }
}
