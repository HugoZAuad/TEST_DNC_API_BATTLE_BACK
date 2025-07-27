import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ArenaCreationService } from '../services/arena-creation.service';
import { ArenaJoinService } from '../services/arena-join.service';
import { ArenaLeaveService } from '../services/arena-leave.service';
import { ArenaStartService } from '../services/arena-start.service';
import { ArenaEndService } from '../services/arena-end.service';
import { ArenaActionService } from '../services/arena-action.service';
import { ArenaStateService } from '../services/arena-state.service';
import { CreateArenaDto } from '../interfaces/dto/create-arena.dto';

@WebSocketGateway({
  namespace: '/arena',
  cors: {
    origin: 'https://test-dnc-api-battle-front.vercel.app',
    credentials: true,
  },
})
export class ArenaGateway {
  constructor(
    private readonly arenaCreationService: ArenaCreationService,
    private readonly arenaJoinService: ArenaJoinService,
    private readonly arenaLeaveService: ArenaLeaveService,
    private readonly arenaStartService: ArenaStartService,
    private readonly arenaEndService: ArenaEndService,
    private readonly arenaActionService: ArenaActionService,
    private readonly arenaStateService: ArenaStateService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createArena')
  createArena(@MessageBody() data: CreateArenaDto) {
    const arena = this.arenaCreationService.createArena({
      name: data.name,
      max_players: data.players?.length || 2,
    });
    this.server.emit('arenaCreated', arena);
    return arena;
  }

  @SubscribeMessage('joinArena')
  joinArena(@MessageBody() data: { arenaId: string; player_id: number; monster_id: number }) {
    const result = this.arenaJoinService.joinArena(data.arenaId, {
      player_id: data.player_id,
      monster_id: data.monster_id,
    });
    this.server.emit('playerJoined', result);
    return result;
  }

  @SubscribeMessage('leaveArena')
  leaveArena(@MessageBody() data: { arenaId: string; player_id: number }) {
    const result = this.arenaLeaveService.leaveArena(data.arenaId, {
      player_id: data.player_id,
    });
    this.server.emit('playerLeft', result);
    return result;
  }

  @SubscribeMessage('startBattle')
  startBattle(@MessageBody() data: { arenaId: string }) {
    const result = this.arenaStartService.startBattle(data.arenaId);
    this.server.emit('battleStarted', result);
    return result;
  }

  @SubscribeMessage('endBattle')
  endBattle(@MessageBody() data: { arenaId: string; winner: { player_id: number; monster: string } }) {
    const result = this.arenaEndService.endBattle(data.arenaId, data);
    this.server.emit('battleEnded', result);
    return result;
  }

  @SubscribeMessage('playerAction')
  playerAction(@MessageBody() data: { arenaId: string; player_id: number; action: string; target_id?: string }) {
    return this.arenaActionService.playerAction(data.arenaId, {
      player_id: data.player_id,
      action: data.action,
      target_id: data.target_id,
    });
  }

  @SubscribeMessage('getArenaState')
  getArenaState(@MessageBody() data: { arenaId: string }) {
    const isOpen = this.arenaStateService.isArenaOpen(data.arenaId);
    const arena = this.arenaCreationService.getArena(data.arenaId);
    return {
      isOpen,
      arena,
    };
  }
}
