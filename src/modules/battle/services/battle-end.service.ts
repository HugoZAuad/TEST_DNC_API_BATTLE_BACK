// src/modules/battle/services/battle-end.service.ts
import { Injectable } from '@nestjs/common';
import { BattleRepository } from '../repositories/battle.repository';
import { PlayerRepository } from '../../player/repositories/player.repository';

@Injectable()
export class BattleEndService {
  constructor(
    private readonly battleRepository: BattleRepository,
    private readonly playerRepository: PlayerRepository
  ) {}

  async handleBattleEnd(
    winnerId: string,
    loserId: string
  ): Promise<{ winnerId: string; isBattleActive: boolean }> {

    await this.battleRepository.endBattle(winnerId, loserId);

    await this.playerRepository.updateStats(Number(winnerId), { wins: 1 });

    await this.playerRepository.updateStats(Number(loserId), { losses: 1 });

    return {
      winnerId,
      isBattleActive: false,
    };
  }
}
