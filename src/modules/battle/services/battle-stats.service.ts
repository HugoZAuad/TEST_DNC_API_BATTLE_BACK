import { Injectable } from '@nestjs/common';

@Injectable()
export class BattleStatsService {
  private playerStats: Map<string, { victories: number; defeats: number; surrenders: number }> = new Map();

  private ensurePlayerStats(playerId: string) {
    if (!this.playerStats.has(playerId)) {
      this.playerStats.set(playerId, { victories: 0, defeats: 0, surrenders: 0 });
    }
  }

  recordVictory(playerId: string) {
    this.ensurePlayerStats(playerId);
    const stats = this.playerStats.get(playerId);
    if (stats) {
      stats.victories++;
    }
  }

  recordDefeat(playerId: string) {
    this.ensurePlayerStats(playerId);
    const stats = this.playerStats.get(playerId);
    if (stats) {
      stats.defeats++;
    }
  }

  recordSurrender(playerId: string) {
    this.ensurePlayerStats(playerId);
    const stats = this.playerStats.get(playerId);
    if (stats) {
      stats.surrenders++;
    }
  }

  getStats(playerId: string) {
    this.ensurePlayerStats(playerId);
    return this.playerStats.get(playerId);
  }
}
