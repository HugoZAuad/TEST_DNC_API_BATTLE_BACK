import { Injectable } from '@nestjs/common';
import { ArenaDto } from '../interfaces/dto/arena.dto';

@Injectable()
export class ArenaCreationService {
  private arenas: Map<string, ArenaDto> = new Map();

  createArena(data: { name: string; max_players: number }): ArenaDto {
    const id = Date.now().toString();
    const arena: ArenaDto = {
      id,
      name: data.name,
      maxPlayers: data.max_players,
      players: [],
    };
    this.arenas.set(id, arena);
    return arena;
  }

  getArena(id: string): ArenaDto | undefined {
    return this.arenas.get(id);
  }
}
