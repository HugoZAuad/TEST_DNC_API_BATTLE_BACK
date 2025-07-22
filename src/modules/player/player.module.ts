import { Module } from '@nestjs/common';
import { PlayerCreateService } from './services/player-create.service';
import { PlayerUpdateService } from './services/player-update.service';
import { PlayerDeleteService } from './services/player-delete.service';
import { PlayerController } from './controllers/player.controller';
import { PlayerRepository } from './repositories/player.repository';

@Module({
  controllers: [PlayerController],
  providers: [PlayerCreateService, PlayerUpdateService, PlayerDeleteService, PlayerRepository],
  exports: [PlayerCreateService, PlayerUpdateService, PlayerDeleteService],
})
export class PlayerModule {}
