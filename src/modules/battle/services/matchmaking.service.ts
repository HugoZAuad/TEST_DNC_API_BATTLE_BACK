import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BattleRepository } from '../repositories/battle.repository';
import { MonsterRepository } from '../../monster/repositories/monster.repository';
import { PlayerRepository } from '../../player/repositories/player.repository';
import { PlayerState } from '../interfaces/interfaces/player-state.interface';
import { BattleGateway } from '../gateway/battle.gateway';

@Injectable()
export class MatchmakingService {
  private availablePlayers: Set<number> = new Set();

  constructor(
    private readonly battleRepository: BattleRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly monsterRepository: MonsterRepository,
    @Inject(forwardRef(() => BattleGateway))
    private readonly battleGateway: BattleGateway,
  ) {}

  async addPlayer(playerId: number): Promise<boolean> {
    const monster = await this.monsterRepository.findByPlayerId(playerId);
    if (!monster) {
      return false;
    }
    this.availablePlayers.add(playerId);
    return true;
  }

  removePlayer(playerId: number) {
    this.availablePlayers.delete(playerId);
  }

  async findOpponent(playerId: number): Promise<PlayerState | undefined> {
    const candidates = Array.from(this.availablePlayers).filter(id => id !== playerId);

    if (candidates.length === 0) {
      const bots = this.battleRepository.getBots();
      if (!bots || bots.length === 0) {
        return undefined;
      }
      const randomIndex = Math.floor(Math.random() * bots.length);
      return bots[randomIndex];
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const opponentId = candidates[randomIndex];

    const player = await this.playerRepository.findById(opponentId);
    const monster = await this.monsterRepository.findByPlayerId(opponentId);

    if (!player || !monster) {
      this.removePlayer(opponentId);
      this.availablePlayers.add(opponentId);

      const socket = this.battleGateway.getSocketByPlayerId(opponentId.toString());
      if (socket) {
        this.battleGateway.sendErrorMessage(socket, 'A partida deu erro. Você foi colocado de volta na fila.');
      }

      return this.findOpponent(playerId);
    }

    return {
      playerId: player.id.toString(),
      hp: monster.hp,
      attack: monster.attack,
      defense: monster.defense,
      speed: monster.speed,
      specialAbility: monster.specialAbility,
      isBot: false,
    };
  }
}
