import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BattleRepository } from '../repositories/battle.repository';
import { PlayerRepository } from '../../player/repositories/player.repository';

@Injectable()
export class BattleEndService {
  constructor(
    @Inject(forwardRef(() => BattleRepository))
    private readonly battleRepository: BattleRepository,

    @Inject(forwardRef(() => PlayerRepository))
    private readonly playerRepository: PlayerRepository
  ) {}

  async handleBattleEnd(
    winnerId: string,
    loserId: string
  ): Promise<{ winnerId: string; isBattleActive: boolean }> {

    await this.battleRepository.endBattle(winnerId, loserId);

    await this.playerRepository.updateStats(Number(winnerId), { winners: 1 });
    await this.playerRepository.updateStats(Number(loserId), { losses: 1 });

    return {
      winnerId,
      isBattleActive: false,
    };
  }
}
