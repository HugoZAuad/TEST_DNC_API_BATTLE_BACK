import { Injectable } from '@nestjs/common';
import { bots } from '../constants/bots';
import { PlayerState } from '../interfaces/interfaces/player-state.interface';

@Injectable()
export class MatchmakingService {
  private waitingPlayers: PlayerState[] = [];

  addPlayer(player: PlayerState) {
    this.waitingPlayers.push(player);
  }

  getMatch(): PlayerState[] | null {
    if (this.waitingPlayers.length >= 2) {
      const players = this.waitingPlayers.splice(0, 2);
      return players;
    } else if (this.waitingPlayers.length === 1) {
      const player = this.waitingPlayers.shift();
      if (player) {
        const bot = bots[Math.floor(Math.random() * bots.length)];
        return [player, bot];
      }
    }
    return null;
  }
}
