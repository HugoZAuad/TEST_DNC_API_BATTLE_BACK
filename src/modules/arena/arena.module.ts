import { Module, forwardRef } from '@nestjs/common';
import { ArenaController } from './controllers/arena.controller';
import { ArenaGateway } from './gateway/arena.gateway';
import { BattleModule } from '../battle/battle.module';
import { PlayerModule } from '../player/player.module';
import { MonsterModule } from '../monster/monster.module';
import { ArenaCreationService } from './services/arena-creation.service';
import { ArenaActionService } from './services/arena-action.service';
import { ArenaJoinService } from './services/arena-join.service';
import { ArenaLeaveService } from './services/arena-leave.service';
import { ArenaStartService } from './services/arena-start.service';
import { ArenaEndService } from './services/arena-end.service';
import { ArenaStateService } from './services/arena-state.service';
import { BattleEndService } from '../battle/services/battle-end.service';

@Module({
  imports: [
    forwardRef(() => BattleModule),
    forwardRef(() => PlayerModule),
    forwardRef(() => MonsterModule),
  ],
  controllers: [ArenaController],
  providers: [
    ArenaGateway,
    ArenaCreationService,
    ArenaActionService,
    ArenaJoinService,
    ArenaLeaveService,
    ArenaStartService,
    ArenaEndService,
    ArenaStateService,
    BattleEndService,
  ],
  exports: [
    ArenaGateway,
    ArenaCreationService,
    ArenaActionService,
    ArenaJoinService,
    ArenaLeaveService,
    ArenaStartService,
    ArenaEndService,
    ArenaStateService,
    BattleEndService,
  ],
})
export class ArenaModule {}
