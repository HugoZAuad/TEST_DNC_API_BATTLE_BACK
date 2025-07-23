import { Injectable } from '@nestjs/common';
import { BattleState } from '../interfaces/interfaces/battle-state.interface';
import { BattleStatsService } from './battle-stats.service';

@Injectable()
export class BattleSurrenderService {
  constructor(private readonly battleStatsService: BattleStatsService) {}

  surrender(battleState: BattleState, playerId: string): BattleState {
    battleState.isBattleActive = false;

    const winner = battleState.players.find(p => p.playerId !== playerId);
    if (winner) {
      (battleState as any).winnerId = winner.playerId;
      this.battleStatsService.recordVictory(winner.playerId);
      this.battleStatsService.recordDefeat(playerId);
    }
    this.battleStatsService.recordSurrender(playerId);
    return battleState;
  }
}
