import { Controller, Post, Body, Param } from '@nestjs/common';
import { ArenaCreationService } from '../services/arena-creation.service';
import { ArenaActionService } from '../services/arena-action.service';
import { ArenaJoinService } from '../services/arena-join.service';
import { ArenaLeaveService } from '../services/arena-leave.service';
import { ArenaStartService } from '../services/arena-start.service';
import { ArenaEndService } from '../services/arena-end.service';

@Controller('arenas')
export class ArenaController {
  constructor(
    private readonly arenaCreationService: ArenaCreationService,
    private readonly arenaActionService: ArenaActionService,
    private readonly arenaJoinService: ArenaJoinService,
    private readonly arenaLeaveService: ArenaLeaveService,
    private readonly arenaStartService: ArenaStartService,
    private readonly arenaEndService: ArenaEndService,
  ) {}

  @Post()
  createArena(@Body() body: { name: string; max_players: number }) {
    return this.arenaCreationService.createArena(body);
  }

  @Post(':id/action')
  playerAction(@Param('id') id: string, @Body() body: { player_id: number; action: string }) {
    return this.arenaActionService.playerAction(id, body);
  }

  @Post(':id/join')
  joinArena(@Param('id') id: string, @Body() body: { player_id: number; monster_id: number }) {
    return this.arenaJoinService.joinArena(id, body);
  }

  @Post(':id/leave')
  leaveArena(@Param('id') id: string, @Body() body: { player_id: number }) {
    return this.arenaLeaveService.leaveArena(id, body);
  }

  @Post(':id/start')
  startBattle(@Param('id') id: string) {
    return this.arenaStartService.startBattle(id);
  }

  @Post(':id/end')
  endBattle(@Param('id') id: string, @Body() body: { winner: { player_id: number; monster: string } }) {
    return this.arenaEndService.endBattle(id, body);
  }
}
