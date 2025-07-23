import { Module } from '@nestjs/common';
import { MonsterController } from './controllers/monster.controller';
import { MonsterRepository } from './repositories/monster.repository';
import { MonsterCreationService } from './services/monster-creation.service';
import { MonsterUpdateService } from './services/monster-update.service';
import { MonsterDeleteService } from './services/monster-delete.service';
import { MonsterFindAllService } from './services/monster-find-all.service';
import { MonsterFindByIdService } from './services/monster-find-by-id.service';
import { MonsterFindByNameService } from './services/monster-find-by-name.service';

@Module({
  imports: [],
  controllers: [MonsterController],
  providers: [
    MonsterRepository,
    MonsterCreationService,
    MonsterUpdateService,
    MonsterDeleteService,
    MonsterFindAllService,
    MonsterFindByIdService,
    MonsterFindByNameService,
  ],
  exports: [
    MonsterRepository,
    MonsterCreationService,
    MonsterUpdateService,
    MonsterDeleteService,
    MonsterFindAllService,
    MonsterFindByIdService,
    MonsterFindByNameService,
  ],
})
export class MonsterModule {}
