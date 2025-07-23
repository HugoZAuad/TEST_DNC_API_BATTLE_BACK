import { Module } from '@nestjs/common';
import { PlayerCreateService } from './services/player-create.service';
import { PlayerUpdateService } from './services/player-update.service';
import { PlayerDeleteService } from './services/player-delete.service';
import { PlayerController } from './controllers/player.controller';
import { PlayerRepository } from './repositories/player.repository';
import { PlayerFindAllService } from './services/player-find-all.service';
import { PlayerFindByIdService } from './services/player-find-by-id.service';
import { PlayerFindByNameService } from './services/player-find-by-name.service';

@Module({
  controllers: [PlayerController],
  providers: [
    PlayerCreateService,
    PlayerUpdateService,
    PlayerDeleteService,
    PlayerRepository,
    PlayerFindAllService,
    PlayerFindByIdService,
    PlayerFindByNameService,
  ],
  exports: [
    PlayerCreateService,
    PlayerUpdateService,
    PlayerDeleteService,
    PlayerRepository,
    PlayerFindAllService,
    PlayerFindByIdService,
    PlayerFindByNameService,
  ],
})
export class PlayerModule {}
