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

  @SubscribeMessage('playerAvailable')
  handlePlayerAvailable(@MessageBody() data: { playerId: number }, @ConnectedSocket() client: Socket) {
    client.emit('availableConfirmed');
  }

  @SubscribeMessage('startBattle')
  async handleStartBattle(@MessageBody() data: { playerId: number }, @ConnectedSocket() client: Socket) {
    const playerId = data.playerId;
    const arena = [...this.arenaCreationService.getAllArenas()].find(([_, a]) =>
      a.players.some(p => p.player_id === playerId)
    )?.[1];

    if (!arena) {
      client.emit('error', 'Arena não encontrada para o jogador');
      return;
    }

    if (!arena.battleState) {
      arena.battleState = {
        turn: 1,
        players: arena.players.map(p => ({
          player_id: p.player_id,
          monster: p.monster_id,
          hp: 100,
          defend: false,
          specialCooldown: 0,
        })),
        isBattleActive: true,
        arenaId: arena.id,
      };
    }

    this.server.to(arena.id).emit('battleStarted', {
      battleState: arena.battleState,
    });
  }

  @SubscribeMessage('battleAction')
  handleBattleAction(@MessageBody() data: { arenaId: string; playerId: number; action: string }, @ConnectedSocket() client: Socket) {
    const arena = this.arenaCreationService.getArena(data.arenaId);
    if (!arena || !arena.battleState || !arena.battleState.isBattleActive) {
      client.emit('error', 'Batalha não encontrada ou inativa');
      return;
    }

    const player = arena.battleState.players.find(p => p.player_id === data.playerId);
    if (!player) {
      client.emit('error', 'Jogador não encontrado na batalha');
      return;
    }

    switch (data.action) {
      case 'attack':
        const target = arena.battleState.players.find(p => p.player_id !== data.playerId);
        if (target) {
          const damage = player.specialCooldown === 0 ? 25 : 20;
          target.hp -= damage;
          player.specialCooldown = Math.max(player.specialCooldown - 1, 0);
        }
        break;
      case 'defend':
        player.defend = true;
        break;
      case 'special':
        if (player.specialCooldown === 0) {
          player.specialCooldown = 3;
        }
        break;
      case 'forfeit':
        arena.battleState.isBattleActive = false;
        arena.battleState.winner = { player_id: null, monster: 'Desistência' };
        break;
      default:
        client.emit('error', 'Ação inválida');
        return;
    }

    arena.battleState.turn += 1;

    this.server.to(data.arenaId).emit('battleUpdate', arena.battleState);
  }
}
