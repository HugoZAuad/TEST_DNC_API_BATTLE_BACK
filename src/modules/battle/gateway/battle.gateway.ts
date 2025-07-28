import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS,
    credentials: true,
  },
})
export class BattleGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Socket conectado:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Socket desconectado:', client.id);
  }

  @SubscribeMessage('playerAvailable')
  handlePlayerAvailable(client: Socket, data: any) {
    console.log('Evento playerAvailable recebido:', data, 'Socket:', client.id);
    client.emit('availableConfirmed');
  }

  @SubscribeMessage('startBattle')
  handleStartBattle(client: Socket, data: any) {
    console.log('Evento startBattle recebido:', data, 'Socket:', client.id);
    // Exemplo de resposta, ajuste conforme sua lógica:
    client.emit('battleStarted', {
      battleState: {
        /* ...dados da batalha... */
      },
    });
  }

  @SubscribeMessage('battleAction')
  handleBattleAction(client: Socket, data: any) {
    console.log('Evento battleAction recebido:', data, 'Socket:', client.id);
    // Exemplo de resposta, ajuste conforme sua lógica:
    client.emit('battleUpdate', {
      /* ...dados atualizados da batalha... */
    });
  }
}
