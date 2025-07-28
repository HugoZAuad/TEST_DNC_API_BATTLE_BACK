import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { MatchmakingService } from '../services/matchmaking.service';
import { PlayerState } from '../interfaces/interfaces/player-state.interface';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://test-dnc-api-battle-front.vercel.app',
    ],
    credentials: true,
  },
})
@Injectable()
export class BattleGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private playerSocketMap = new Map<string, Socket>();

  constructor(private readonly matchmakingService: MatchmakingService) {}

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
    try {
      if (!data || !data.playerId) {
        client.emit('error', { message: 'playerId is required' });
        return;
      }
      console.log('Evento playerAvailable recebido:', data, 'Socket:', client.id);
      this.playerSocketMap.set(data.playerId.toString(), client);
      const player: PlayerState = {
        playerId: data.playerId.toString(),
        hp: 100,
        attack: 10,
        defense: 5,
        speed: 10,
        specialAbility: 'None',
        isBot: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.matchmakingService.addPlayer(player);

      const match = this.matchmakingService.getMatch();
      if (match) {
        const battleId = `battle-${Date.now()}`;
        console.log('Match found:', match);

        // Join players to the battle room and notify
        match.forEach(p => {
          const socket = this.getSocketByPlayerId(p.playerId);
          if (socket) {
            socket.join(battleId);
          } else {
            console.warn(`Socket not found for playerId ${p.playerId}`);
          }
        });

        this.server.to(battleId).emit('battleStarted', { battleId, players: match });
      }

      client.emit('availableConfirmed');
    } catch (error) {
      console.error('Error in handlePlayerAvailable:', error);
      client.emit('error', { message: 'Internal server error' });
    }
  }

  public getSocketByPlayerId(playerId: string): Socket | undefined {
    return this.playerSocketMap.get(playerId);
  }

  public async handleAttack(data: any, client: Socket) {
    console.log(
      'handleAttack chamado via serviço:',
      data,
      'Socket:',
      client.id
    );
    client.emit('battleUpdate', {
      /* ...dados atualizados da batalha... */
    });
  }

  @SubscribeMessage('startBattle')
  public async handleStartBattle(client: Socket, data: any) {
    console.log(
      'Evento startBattle recebido:',
      data,
      'Socket:',
      client.id
    );
    const battleId = data.battleId;
    if (battleId) {
      this.server.to(battleId).emit('battleStarted', { battleState: data });
      console.log(`Evento battleStarted emitido para a sala ${battleId}`);
    } else {
      client.emit('error', { message: 'battleId is required to start battle' });
    }
  }
}
