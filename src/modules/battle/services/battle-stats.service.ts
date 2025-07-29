import { Injectable } from '@nestjs/common';

@Injectable()
export class BattleStatsService {
  private playerStats: Map<string, { victories: number; defeats: number; surrenders: number }> = new Map();

  private ensurePlayerStats(playerId: string) {
    if (!this.playerStats.has(playerId)) {
      this.playerStats.set(playerId, { victories: 0, defeats: 0, surrenders: 0 });
    }
  }

  async recordVictory(playerId: string): Promise<void> {
    this.ensurePlayerStats(playerId);
    const stats = this.playerStats.get(playerId);
    if (stats) {
      stats.victories++;
    }
  }

  async recordDefeat(playerId: string): Promise<void> {
    this.ensurePlayerStats(playerId);
    const stats = this.playerStats.get(playerId);
    if (stats) {
      stats.defeats++;
    }
  }

  async recordSurrender(playerId: string): Promise<void> {
    this.ensurePlayerStats(playerId);
    const stats = this.playerStats.get(playerId);
    if (stats) {
      stats.surrenders++;
    }
  }

  async getStats(playerId: string): Promise<{ victories: number; defeats: number; surrenders: number }> {
    this.ensurePlayerStats(playerId);
    return this.playerStats.get(playerId)!;
  }
}
