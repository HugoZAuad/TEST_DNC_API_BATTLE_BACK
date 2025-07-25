import { Module, forwardRef } from '@nestjs/common';
import { BattleGateway } from './gateway/battle.gateway';
import { MatchmakingService } from './services/matchmaking.service';
import { BattleDamageService } from './services/battle-damage.service';
import { BattleTurnService } from './services/battle-turn.service';
import { BattleSurrenderService } from './services/battle-surrender.service';
import { BattleRepository } from './repositories/battle.repository';
import { BattleStatsService } from './services/battle-stats.service';
import { PlayerModule } from '../player/player.module';
import { MonsterModule } from '../monster/monster.module';

@Module({
  imports: [
    forwardRef(() => PlayerModule),
    forwardRef(() => MonsterModule),
    forwardRef(() => import('../arena/arena.module').then(m => m.ArenaModule)),
  ],
  providers: [
    BattleGateway,
    MatchmakingService,
    BattleDamageService,
    BattleTurnService,
    BattleSurrenderService,
    BattleRepository,
    BattleStatsService,
  ],
  exports: [BattleGateway, MatchmakingService],
})
export class BattleModule {}
