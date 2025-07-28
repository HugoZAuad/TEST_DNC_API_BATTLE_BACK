import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'https://test-dnc-api-battle-front.vercel.app',
    ],
    credentials: true,
  },
})
export class BattleGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private playerSocketMap = new Map<string, Socket>();

  handleConnection(client: Socket) {
    console.log('Socket conectado:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Socket desconectado:', client.id);
    for (const [playerId, socket] of this.playerSocketMap.entries()) {
      if (socket.id === client.id) {
        this.playerSocketMap.delete(playerId);
        break;
      }
    }
  }

  @SubscribeMessage('playerAvailable')
  handlePlayerAvailable(client: Socket, data: any) {
    console.log('Evento playerAvailable recebido:', data, 'Socket:', client.id);
    this.playerSocketMap.set(data.playerId.toString(), client);
    client.emit('availableConfirmed');
  }

  public getSocketByPlayerId(playerId: string): Socket | undefined {
    return this.playerSocketMap.get(playerId);
  }

  public async handleAttack(data: any, client: Socket) {
    console.log('handleAttack chamado via serviço:', data, 'Socket:', client.id);
    // ...lógica de ataque...
    client.emit('battleUpdate', { /* ...dados atualizados da batalha... */ });
  }

  public async handleStartBattle(data: any, client: Socket) {
    console.log('handleStartBattle chamado via serviço:', data, 'Socket:', client.id);
    // ...lógica de início de batalha...
    client.emit('battleStarted', { battleState: { /* ...dados da batalha... */ } });
  }
}
