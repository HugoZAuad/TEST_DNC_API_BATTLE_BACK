import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, forwardRef } from '@nestjs/common';
import { MatchmakingService } from '../services/matchmaking.service';
import { BattleDamageService } from '../services/battle-damage.service';
import { BattleTurnService } from '../services/battle-turn.service';
import { BattleSurrenderService } from '../services/battle-surrender.service';
import { BattleRepository } from '../repositories/battle.repository';
import { AttackDto } from '../interfaces/dto/attack.dto';
import { SurrenderDto } from '../interfaces/dto/surrender.dto';

@WebSocketGateway({ namespace: '/battle', cors: { origin: '*' } })
export class BattleGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private players: Map<string, string> = new Map(); // socketId -> playerId
  private playerSockets: Map<string, string> = new Map(); // playerId -> socketId

  constructor(
    @Inject(forwardRef(() => MatchmakingService))
    private readonly matchmakingService: MatchmakingService,
    private readonly battleDamageService: BattleDamageService,
    private readonly battleTurnService: BattleTurnService,
    private readonly battleSurrenderService: BattleSurrenderService,
    private readonly battleRepository: BattleRepository,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Player connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Player disconnected: ${client.id}`);
    const playerId = this.players.get(client.id);
    if (playerId) {
      this.matchmakingService.removePlayer(parseInt(playerId));
      this.playerSockets.delete(playerId);
    }
    this.players.delete(client.id);
  }

  public sendErrorMessage(client: Socket, message: string) {
    client.emit('error', message);
  }

  public getSocketByPlayerId(playerId: string): Socket | undefined {
    const socketId = this.playerSockets.get(playerId);
    if (!socketId) return undefined;
    return this.server.sockets.sockets.get(socketId);
  }

  @SubscribeMessage('playerAvailable')
  async handlePlayerAvailable(@MessageBody() data: { playerId: number }, @ConnectedSocket() client: Socket) {
    const added = await this.matchmakingService.addPlayer(data.playerId);
    if (!added) {
      this.sendErrorMessage(client, 'Você precisa ter um monstro criado para entrar na batalha.');
      return;
    }
    this.players.set(client.id, data.playerId.toString());
    this.playerSockets.set(data.playerId.toString(), client.id);
    client.emit('availableConfirmed');
  }

  @SubscribeMessage('startBattle')
  async handleStartBattle(@MessageBody() data: { playerId: number }, @ConnectedSocket() client: Socket) {
    const opponent = await this.matchmakingService.findOpponent(data.playerId);
    if (!opponent) {
      this.sendErrorMessage(client, 'Nenhum oponente disponível no momento.');
      return;
    }

    const players = [
      { playerId: data.playerId.toString(), hp: 100, attack: 10, defense: 5, speed: 10, specialAbility: 'None', isBot: false },
      { playerId: opponent.playerId, hp: 100, attack: 10, defense: 5, speed: 10, specialAbility: 'None', isBot: opponent.isBot },
    ];
    const battleId = `${data.playerId}-${opponent.playerId}`;
    this.battleRepository.createBattle(battleId, players);

    const battleState = this.battleRepository.getBattle(battleId);
    if (!battleState) {
      this.sendErrorMessage(client, 'Erro ao iniciar a batalha.');
      return;
    }

    this.battleRepository.updateBattle(battleId, battleState);
    client.emit('battleStarted', { battleState });

    const opponentSocket = this.getSocketByPlayerId(opponent.playerId);
    if (opponentSocket) {
      opponentSocket.emit('battleStarted', { battleState });
    }
  }

  @SubscribeMessage('attack')
  async handleAttack(@MessageBody() data: AttackDto, @ConnectedSocket() client: Socket) {
    await this.processAttack(data, client);
  }

  public async processAttack(data: AttackDto, client: Socket) {
    const attackerId = this.players.get(client.id);
    if (!attackerId) {
      this.sendErrorMessage(client, 'Jogador não autenticado.');
      return;
    }

    const battleState = this.battleRepository.getBattleByPlayerId(attackerId);
    if (!battleState) {
      this.sendErrorMessage(client, 'Batalha não encontrada.');
      return;
    }

    if (!this.battleTurnService.isPlayerTurn(battleState, attackerId)) {
      this.sendErrorMessage(client, 'Não é seu turno.');
      return;
    }

    const attacker = battleState.players.find(p => p.playerId === attackerId);
    const defender = battleState.players.find(p => p.playerId === data.targetId.toString());
    if (!attacker || !defender) {
      this.sendErrorMessage(client, 'Jogador inválido.');
      return;
    }

    let attackValue = attacker.attack;
    // Verificar se special está ativo e aplicar bônus de 25%
    if (attacker.specialActive) {
      attackValue = Math.floor(attackValue * 1.25);
      attacker.specialActive = false;
      attacker.specialCooldown = 3;
    }

    const damage = this.battleDamageService.calculateDamage(attackValue, defender.defense);
    defender.hp -= damage;
    if (defender.hp < 0) defender.hp = 0;

    if (defender.hp === 0) {
      battleState.isBattleActive = false;
      (battleState as any).winnerId = attacker.playerId;
    } else {
      this.battleTurnService.switchTurn(battleState);
    }

    // Atualizar cooldowns
    battleState.players.forEach(player => {
      if (player.specialCooldown && player.specialCooldown > 0) {
        player.specialCooldown -= 1;
      }
    });

    const battleId = `${attackerId}-${defender.playerId}`;
    this.battleRepository.updateBattle(battleId, battleState);

    this.server.emit('battleUpdate', battleState);
  }

  @SubscribeMessage('surrender')
  async handleSurrender(@MessageBody() data: SurrenderDto, @ConnectedSocket() client: Socket) {
    const playerId = this.players.get(client.id);
    if (!playerId) {
      this.sendErrorMessage(client, 'Jogador não autenticado.');
      return;
    }

    const battleState = this.battleRepository.getBattleByPlayerId(playerId);
    if (!battleState) {
      this.sendErrorMessage(client, 'Batalha não encontrada.');
      return;
    }

    const updatedBattle = this.battleSurrenderService.surrender(battleState, playerId);
    this.battleRepository.updateBattle(battleState.players[0].playerId.toString(), updatedBattle);

    this.server.emit('battleUpdate', updatedBattle);
  }
}
