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
import { BotAIService } from './services/bot-ai.service';
import { ArenaModule } from '../arena/arena.module';

@Module({
  imports: [
    forwardRef(() => PlayerModule),
    forwardRef(() => MonsterModule),
    forwardRef(() => ArenaModule),
  ],
  providers: [
    BattleGateway,
    MatchmakingService,
    BattleDamageService,
    BattleTurnService,
    BattleSurrenderService,
    BattleRepository,
    BattleStatsService,
    BotAIService,
  ],
  exports: [
    BattleGateway,
    MatchmakingService,
    BattleTurnService,
    BotAIService,
    BattleRepository,
  ],
})
export class BattleModule {}
