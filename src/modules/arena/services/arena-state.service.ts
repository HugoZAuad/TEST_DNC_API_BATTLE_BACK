import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ArenaCreationService } from './arena-creation.service';
import { MatchmakingService } from '../../battle/services/matchmaking.service';
import { BattleGateway } from '../../battle/gateway/battle.gateway';
import { PlayerState } from '../../battle/interfaces/interfaces/player-state.interface';
import { Socket } from 'socket.io';

@Injectable()
export class ArenaStateService {
  private arenaStates: Map<string, { isOpen: boolean; timer?: NodeJS.Timeout }> = new Map();

  constructor(
    @Inject(forwardRef(() => ArenaCreationService))
    private readonly arenaCreationService: ArenaCreationService,

    private readonly matchmakingService: MatchmakingService,

    @Inject(forwardRef(() => BattleGateway))
    private readonly battleGateway: BattleGateway,
  ) { }

  openArena(arenaId: string) {
    if (this.arenaStates.has(arenaId)) return;

    this.arenaStates.set(arenaId, { isOpen: true });

    const timer = setTimeout(() => {
      this.closeArena(arenaId);
    }, 60000);

    this.arenaStates.get(arenaId)!.timer = timer;
  }

  closeArena(arenaId: string) {
    const state = this.arenaStates.get(arenaId);
    if (!state) return;

    state.isOpen = false;
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = undefined;
    }

    this.startBattles(arenaId);
  }

  isArenaOpen(arenaId: string): boolean {
    const state = this.arenaStates.get(arenaId);
    return state ? state.isOpen : false;
  }

  private async startBattles(arenaId: string) {
    const arena = this.arenaCreationService.getArena(arenaId);
    if (!arena) return;

    const players = arena.players;
    if (players.length === 0) {
      console.log(`Arena ${arenaId} fechada sem jogadores. Nenhuma batalha iniciada.`);
      return;
    }

    const playerCount = players.length;
    const evenCount = playerCount % 2 === 0 ? playerCount : playerCount - 1;

    for (let i = 0; i < evenCount; i += 2) {
      const player1 = players[i];
      const player2 = players[i + 1];

      await this.matchmakingService.addPlayer(player1.playerId);
      await this.matchmakingService.addPlayer(player2.playerId);

      const socket1 = this.battleGateway.getSocketByPlayerId(player1.playerId);
      const socket2 = this.battleGateway.getSocketByPlayerId(player2.playerId);

      if (socket1) {
        this.battleGateway.handleStartBattle(socket1, {
          playerId: player1.playerId,
          opponent: player2,
          arenaId,
        });
      }

      if (socket2) {
        this.battleGateway.handleStartBattle(socket2, {
          playerId: player2.playerId,
          opponent: player1,
          arenaId,
        });
      }

      console.log(`🆚 Batalha iniciada entre ${player1.playerId} e ${player2.playerId} na arena ${arenaId}`);
    }

    if (playerCount > evenCount) {
      const lastPlayer = players[playerCount - 1];
      console.log(`⚔️ Jogador ${lastPlayer.playerId} sem oponente. Iniciando batalha contra bot.`);

      await this.matchmakingService.addPlayer(lastPlayer.playerId);

      const socket = this.battleGateway.getSocketByPlayerId(lastPlayer.playerId);
      if (socket) {
        await this.startBattleVsBot(lastPlayer, socket, arenaId);
      }
    }
  }

  private async startBattleVsBot(player: PlayerState, socket: Socket, arenaId: string) {
    const bot: PlayerState = {
      playerId: 'BOT',
      username: 'Bot',
      hp: 100,
      attack: 8,
      defense: 4,
      speed: 5,
      specialAbility: 'None',
      isBot: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(`🤖 Iniciando batalha do player ${player.playerId} contra o bot na arena ${arenaId}.`);

    this.battleGateway.handleStartBattle(socket, {
      playerId: player.playerId,
      opponent: bot,
      isBot: true,
      arenaId,
    });

    setTimeout(() => {
      console.log(`🤖 Bot atacando o player ${player.playerId} na arena ${arenaId}`);
      this.battleGateway.handleAttack(socket, {
        attackerId: bot.playerId,
        targetId: player.playerId,
        arenaId,
      });
    }, 5000);
  }
}
