import { Module } from '@nestjs/common';
import { MonsterController } from './controllers/monster.controller';
import { MonsterRepository } from './repositories/monster.repository';
import { MonsterCreationService } from './services/monster-creation.service';
import { MonsterQueryService } from './services/monster-query.service';
import { MonsterUpdateService } from './services/monster-update.service';
import { MonsterDeleteService } from './services/monster-delete.service';

@Module({
  imports: [],
  controllers: [MonsterController],
  providers: [
    MonsterRepository,
    MonsterCreationService,
    MonsterQueryService,
    MonsterUpdateService,
    MonsterDeleteService,
  ],
  exports: [
    MonsterCreationService,
    MonsterQueryService,
    MonsterUpdateService,
    MonsterDeleteService,
  ],
})
export class MonsterModule {}
