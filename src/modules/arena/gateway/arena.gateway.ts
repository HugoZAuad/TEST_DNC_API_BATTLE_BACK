import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { MatchmakingService } from '../../battle/services/matchmaking.service';
import { PlayerState } from '../../battle/interfaces/interfaces/player-state.interface';
import { ArenaCreationService } from '../../arena/services/arena-creation.service';
import { ArenaDto } from '../../arena/interfaces/dto/arena.dto';

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

  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly arenaCreationService: ArenaCreationService
  ) {}

  handleConnection(client: Socket) {
    console.log(`🔌 Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [playerId, socket] of this.playerSocketMap.entries()) {
      if (socket.id === client.id) {
        this.playerSocketMap.delete(playerId);
        console.log(`❌ Cliente desconectado: ${playerId}`);
        break;
      }
    }
  }

  @SubscribeMessage('playerAvailable')
  async handlePlayerAvailable(client: Socket, data: any) {
    try {
      if (!data || !data.playerId) {
        client.emit('error', { message: 'playerId is required' });
        return;
      }

      const playerId = data.playerId.toString();
      this.playerSocketMap.set(playerId, client);

      const player: PlayerState = {
        playerId,
        username: data.username || `Jogador ${playerId}`,
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
        const arenaId = `arena-${Date.now()}`;
        const arena: ArenaDto = this.arenaCreationService.createArena(arenaId, match);

        match.forEach((p) => {
          const socket = this.getSocketByPlayerId(p.playerId);
          if (socket) {
            socket.join(arenaId);
            socket.emit('matchFound', { arenaId, players: match });
          }
        });

        this.server.to(arenaId).emit('battleStarted', {
          arenaId,
          battleState: arena.battleState,
        });
      }

      client.emit('availableConfirmed');
    } catch (error) {
      console.error('Erro no matchmaking:', error);
      client.emit('error', { message: 'Internal server error' });
    }
  }

  @SubscribeMessage('startBattle')
  async handleStartBattle(client: Socket, data: any) {
    const battleId = data.battleId;
    if (battleId) {
      this.server.to(battleId).emit('battleStarted', { battleState: data });
    } else {
      client.emit('error', { message: 'battleId is required to start battle' });
    }
  }

  @SubscribeMessage('battleAction')
  async handleBattleAction(client: Socket, data: any) {
    this.server.to(data.arenaId).emit('battleUpdate', {
      action: data.action,
      from: data.playerId,
      to: data.target_id,
    });
  }

  @SubscribeMessage('attack')
  async handleAttack(client: Socket, data: { arenaId: string; attackerId: string; targetId: string }) {
    const { arenaId, attackerId, targetId } = data;

    const arena = this.arenaCreationService.getArena(arenaId);
    if (!arena) {
      client.emit('error', { message: 'Arena não encontrada' });
      return;
    }

    const attacker = arena.battleState.players.find(p => p.playerId === attackerId);
    const target = arena.battleState.monsters.find(m => m.playerId === targetId);

    if (!attacker || !target) {
      client.emit('error', { message: 'Atacante ou alvo inválido' });
      return;
    }

    const damage = Math.max(attacker.attack - target.defense, 1);
    target.hp = Math.max(target.hp - damage, 0);

    this.server.to(arenaId).emit('battleUpdate', {
      type: 'attack',
      attackerId,
      targetId,
      damage,
      targetHp: target.hp,
    });

    if (target.hp === 0) {
      this.server.to(arenaId).emit('monsterDefeated', {
        targetId,
        message: `${target.name} foi derrotado!`,
      });
    }
  }

  public getSocketByPlayerId(playerId: string): Socket | undefined {
    return this.playerSocketMap.get(playerId);
  }
}
