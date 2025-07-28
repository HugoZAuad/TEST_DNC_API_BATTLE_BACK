import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://test-dnc-api-battle-front.vercel.app'],
    credentials: true,
  },
})
export class BattleGateway {
  @WebSocketServer()
  server: Server;

  private playerSockets: Map<string, Socket> = new Map();

  registerSocket(playerId: string, socket: Socket) {
    this.playerSockets.set(playerId, socket);
  }

  unregisterSocket(playerId: string) {
    this.playerSockets.delete(playerId);
  }

  getSocketByPlayerId(playerId: string): Socket | undefined {
    return this.playerSockets.get(playerId);
  }

  sendErrorMessage(socket: Socket, message: string, code?: number) {
    socket.emit('errorMessage', {
      type: 'error',
      message,
      code: code ?? 500,
    });
  }

  sendMessage(socket: Socket, event: string, payload: any) {
    socket.emit(event, payload);
  }

  handleConnection(socket: Socket) {
    console.log(`Socket conectado: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Socket desconectado: ${socket.id}`);
    for (const [playerId, s] of this.playerSockets.entries()) {
      if (s.id === socket.id) {
        this.unregisterSocket(playerId);
        break;
      }
    }
  }

  @SubscribeMessage('registerPlayer')
  handleRegisterPlayer(
    @MessageBody() data: { playerId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.registerSocket(data.playerId, socket);
    socket.emit('playerRegistered', { success: true });
  }

  async handleStartBattle(data: { playerId: number }, socket: Socket) {
    socket.emit('battleStarted', { playerId: data.playerId });
  }

  async handleAttack(data: { playerId: string; targetId: string }, socket: Socket) {
    socket.emit('attack', data);
  }
}
