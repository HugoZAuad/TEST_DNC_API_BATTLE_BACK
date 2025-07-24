import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ArenaCreationService } from '../services/arena-creation.service';

@WebSocketGateway({ namespace: '/arena' })
export class ArenaGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly arenaCreationService: ArenaCreationService) {}

  @SubscribeMessage('joinArena')
  handleJoinArena(@MessageBody() data: { arenaId: string; playerId: number }, @ConnectedSocket() client: Socket) {
    // Implementar lógica para adicionar jogador à arena e emitir atualizações
    const arena = this.arenaCreationService.getArena(data.arenaId);
    if (!arena) {
      client.emit('error', 'Arena não encontrada');
      return;
    }
    client.join(data.arenaId);
    this.server.to(data.arenaId).emit('playerJoined', { playerId: data.playerId });
  }

  @SubscribeMessage('leaveArena')
  handleLeaveArena(@MessageBody() data: { arenaId: string; playerId: number }, @ConnectedSocket() client: Socket) {
    // Implementar lógica para remover jogador da arena e emitir atualizações
    const arena = this.arenaCreationService.getArena(data.arenaId);
    if (!arena) {
      client.emit('error', 'Arena não encontrada');
      return;
    }
    client.leave(data.arenaId);
    this.server.to(data.arenaId).emit('playerLeft', { playerId: data.playerId });
  }

  @SubscribeMessage('battleAction')
  handleBattleAction(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // Implementar lógica para processar ações de batalha e emitir atualizações
    this.server.to(data.arenaId).emit('battleUpdate', data);
  }
}
