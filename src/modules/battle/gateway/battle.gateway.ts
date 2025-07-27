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
    origin: '*',
  },
})
export class BattleGateway {
  @WebSocketServer()
  server: Server;

  // Mapeia playerId para seu socket
  private playerSockets: Map<string, Socket> = new Map();

  /**
   * Registra o socket de um jogador
   */
  registerSocket(playerId: string, socket: Socket) {
    this.playerSockets.set(playerId, socket);
  }

  /**
   * Remove o socket de um jogador
   */
  unregisterSocket(playerId: string) {
    this.playerSockets.delete(playerId);
  }

  /**
   * Recupera o socket de um jogador
   */
  getSocketByPlayerId(playerId: string): Socket | undefined {
    return this.playerSockets.get(playerId);
  }

  /**
   * Envia uma mensagem de erro para o jogador
   */
  sendErrorMessage(socket: Socket, message: string, code?: number) {
    socket.emit('errorMessage', {
      type: 'error',
      message,
      code: code ?? 500,
    });
  }

  /**
   * Envia uma mensagem genérica para o jogador
   */
  sendMessage(socket: Socket, event: string, payload: any) {
    socket.emit(event, payload);
  }

  /**
   * Evento de conexão inicial
   */
  handleConnection(socket: Socket) {
    console.log(`Socket conectado: ${socket.id}`);
  }

  /**
   * Evento de desconexão
   */
  handleDisconnect(socket: Socket) {
    console.log(`Socket desconectado: ${socket.id}`);
    // Opcional: remover da lista de jogadores
    for (const [playerId, s] of this.playerSockets.entries()) {
      if (s.id === socket.id) {
        this.unregisterSocket(playerId);
        break;
      }
    }
  }

  /**
   * Exemplo de evento recebido do cliente
   */
  @SubscribeMessage('registerPlayer')
  handleRegisterPlayer(
    @MessageBody() data: { playerId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.registerSocket(data.playerId, socket);
    socket.emit('playerRegistered', { success: true });
  }
}
