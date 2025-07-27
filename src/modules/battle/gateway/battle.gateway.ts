import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchmakingService } from '../services/matchmaking.service';
import { BattleState } from '../interfaces/interfaces/battle-state.interface';
import { BattleDamageService } from '../services/battle-damage.service';
import { BattleTurnService } from '../services/battle-turn.service';
import { BattleSurrenderService } from '../services/battle-surrender.service';

@WebSocketGateway({ namespace: '/arena' })
export class BattleGateway {
  @WebSocketServer()
  server: Server;

  private socketsByPlayerId: Map<string, Socket> = new Map();
  private battles: Map<string, BattleState> = new Map();

  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly damageService: BattleDamageService,
    private readonly turnService: BattleTurnService,
    private readonly surrenderService: BattleSurrenderService,
  ) {}

  getSocketByPlayerId(playerId: string): Socket | undefined {
    return this.socketsByPlayerId.get(playerId);
  }

  sendErrorMessage(socket: Socket, message: string) {
    socket.emit('error', message);
  }

  @SubscribeMessage('startBattle')
  async handleStartBattle(@MessageBody() data: { playerId: number }, @ConnectedSocket() client: Socket) {
    const playerId = data.playerId.toString();
    this.socketsByPlayerId.set(playerId, client);

    await this.matchmakingService.addPlayer(data.playerId);
    const opponent = await this.matchmakingService.findOpponent(data.playerId);

    if (!opponent) {
      client.emit('error', 'Nenhum oponente ou bot disponível');
      return;
    }

    const battleId = `battle-${Date.now()}`;
    const battleState: BattleState = {
      id: battleId,
      isBattleActive: true,
      currentTurnPlayerId: playerId,
      players: [
        {
          playerId,
          hp: 100,
          attack: 20,
          defense: 10,
          speed: 5,
          specialAbility: 'none',
          isBot: false,
        },
        opponent,
      ],
    };

    this.battles.set(battleId, battleState);

    client.emit('battleStarted', { battleState });
    const opponentSocket = this.getSocketByPlayerId(opponent.playerId);
    if (opponentSocket && !opponent.isBot) {
      opponentSocket.emit('battleStarted', { battleState });
    }
  }

  @SubscribeMessage('battleAction')
  handleBattleAction(@MessageBody() data: { battleId: string; playerId: string; action: string }, @ConnectedSocket() client: Socket) {
    const battle = this.battles.get(data.battleId);
    if (!battle || !battle.isBattleActive) {
      client.emit('error', 'Batalha não encontrada ou encerrada');
      return;
    }

    if (!this.turnService.isPlayerTurn(battle, data.playerId)) {
      client.emit('error', 'Não é seu turno');
      return;
    }

    const player = battle.players.find(p => p.playerId === data.playerId);
    const opponent = battle.players.find(p => p.playerId !== data.playerId);

    switch (data.action) {
      case 'attack':
        const damage = this.damageService.calculateDamage(player!.attack, opponent!.defense);
        opponent!.hp -= damage;
        break;
      case 'defend':
        player!.defense += 5;
        break;
      case 'special':
        opponent!.hp -= 30;
        break;
      case 'forfeit':
        this.surrenderService.surrender(battle, data.playerId);
        break;
      default:
        client.emit('error', 'Ação inválida');
        return;
    }

    if (opponent!.hp <= 0) {
      battle.isBattleActive = false;
      battle.winnerId = player!.playerId;
    } else {
      this.turnService.switchTurn(battle);
    }

    this.server.to(data.battleId).emit('battleUpdate', battle);
  }
}
