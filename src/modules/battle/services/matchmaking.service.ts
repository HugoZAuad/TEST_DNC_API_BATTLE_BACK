import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '../../player/repositories/player.repository';
import { BattleRepository } from '../repositories/battle.repository';
import { MonsterRepository } from '../../monster/repositories/monster.repository';
import { BattleGateway } from '../gateway/battle.gateway';
import { PlayerState } from '../interfaces/interfaces/player-state.interface';

@Injectable()
export class MatchmakingService {
  private availablePlayers: Set<number> = new Set();

  constructor(
    private readonly battleRepository: BattleRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly monsterRepository: MonsterRepository,
    private readonly battleGateway: BattleGateway,
  ) {}

  async addPlayer(playerId: number): Promise<void> {
    this.availablePlayers.add(playerId);
  }

  async findOpponent(playerId: number, waitTimeMs = 5000): Promise<PlayerState | undefined> {
    const pollIntervalMs = 500;
    const startTime = Date.now();

    while (Date.now() - startTime < waitTimeMs) {
      for (const opponentId of this.availablePlayers) {
        if (opponentId !== playerId) {
          this.availablePlayers.delete(opponentId);

          const opponent = await this.playerRepository.findById(opponentId);
          const monsters = await this.monsterRepository.findByPlayerId(opponentId);

          if (!opponent || monsters.length === 0) {
            continue;
          }

          const monster = monsters[0];

          return {
            playerId: opponentId.toString(),
            hp: monster.hp,
            attack: monster.attack,
            defense: monster.defense,
            speed: monster.speed,
            specialAbility: monster.specialAbility,
            isBot: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
      }

      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    const bots = this.battleRepository.getBots();
    if (!bots || bots.length === 0) {
      return undefined;
    }

    const bot = bots[Math.floor(Math.random() * bots.length)];
    return bot;
  }
}
