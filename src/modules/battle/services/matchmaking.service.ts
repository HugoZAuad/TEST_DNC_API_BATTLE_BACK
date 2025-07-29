import { Injectable } from '@nestjs/common';
import { bots } from '../constants/bots';
import { PlayerState } from '../interfaces/interfaces/player-state.interface';

interface WaitingPlayer {
  player: PlayerState;
  timestamp: number;
}

@Injectable()
export class MatchmakingService {
  private waitingPlayers: WaitingPlayer[] = [];
  private readonly BOT_TIMEOUT = 10000;

  addPlayer(player: PlayerState) {
    console.log(`🟡 Adicionando jogador à fila: ${player.username}`);
    this.waitingPlayers.push({
      player,
      timestamp: Date.now()
    });
  }

  getMatch(): PlayerState[] | null {
    this.cleanupExpiredPlayers();

    if (this.waitingPlayers.length >= 2) {
      const players = this.waitingPlayers.splice(0, 2).map(wp => wp.player);
      console.log(`✅ Match encontrado entre: ${players[0].username} e ${players[1].username}`);
      return players;
    }

    if (this.waitingPlayers.length === 1) {
      const wp = this.waitingPlayers[0];
      const now = Date.now();
      const waitTime = now - wp.timestamp;

      if (waitTime >= this.BOT_TIMEOUT) {
        this.waitingPlayers.shift();
        const bot = this.getRandomBot();
        console.log(`🤖 Match com bot: ${wp.player.username} vs ${bot.username}`);
        return [wp.player, bot];
      }
    }

    return null;
  }

  private cleanupExpiredPlayers() {
    const MAX_WAIT = 60000; // 1 minuto
    const now = Date.now();
    this.waitingPlayers = this.waitingPlayers.filter(wp => now - wp.timestamp < MAX_WAIT);
  }

  private getRandomBot(): PlayerState {
    const rawBot = bots[Math.floor(Math.random() * bots.length)];
    return {
      ...rawBot,
      playerId: `bot-${Math.floor(Math.random() * 10000)}`,
      isBot: true
    };
  }
}
