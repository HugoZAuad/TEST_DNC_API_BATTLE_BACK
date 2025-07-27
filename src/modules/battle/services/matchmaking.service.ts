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
    const monsters = await this.monsterRepository.findByPlayerId(playerId);
    if (!monsters || monsters.length === 0) {
      return false;
    }
    this.availablePlayers.add(playerId);
    return true;
  }

  removePlayer(playerId: number) {
    this.availablePlayers.delete(playerId);
  }

  async findOpponent(playerId: number): Promise<PlayerState | undefined> {
    const waitTimeMs = 5000;
    const pollIntervalMs = 500;
    const startTime = Date.now();

    while (Date.now() - startTime < waitTimeMs) {
      const candidates = Array.from(this.availablePlayers).filter(id => id !== playerId);
      if (candidates.length > 0) {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        const opponentId = candidates[randomIndex];

        const player = await this.playerRepository.findById(opponentId);
        const monsters = await this.monsterRepository.findByPlayerId(opponentId);

        if (!player || !monsters || monsters.length === 0) {
          this.removePlayer(opponentId);
          this.availablePlayers.add(opponentId);

          const socket = this.battleGateway.getSocketByPlayerId(opponentId.toString());
          if (socket) {
            this.battleGateway.sendErrorMessage(socket, 'A partida deu erro. Você foi colocado de volta na fila.');
          }
          continue;
        }

        const monster = monsters[0]; // Seleciona o primeiro monstro para o jogador

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
      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }

    // Após 5 segundos, retorna bot
    const bots = this.battleRepository.getBots();
    if (!bots || bots.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * bots.length);
    return bots[randomIndex];
  }
}
