import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ArenaCreationService } from './arena-creation.service';
import { MatchmakingService } from '../../battle/services/matchmaking.service';
import { BattleGateway } from '../../battle/gateway/battle.gateway';

@Injectable()
export class ArenaStateService {
  private arenaStates: Map<string, { isOpen: boolean; timer?: NodeJS.Timeout }> = new Map();

  constructor(
    @Inject(forwardRef(() => ArenaCreationService))
    private readonly arenaCreationService: ArenaCreationService,
    private readonly matchmakingService: MatchmakingService,
    private readonly battleGateway: BattleGateway,
  ) {}

  openArena(arenaId: string) {
    if (this.arenaStates.has(arenaId)) {
      return;
    }
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
      console.log(`Arena ${arenaId} closed with no players, starting battle vs bot.`);
      return;
    }

    const playerCount = players.length;
    const evenCount = playerCount % 2 === 0 ? playerCount : playerCount - 1;

    for (let i = 0; i < evenCount; i += 2) {
      const player1 = players[i];
      const player2 = players[i + 1];
      await this.matchmakingService.addPlayer(player1.player_id);
      await this.matchmakingService.addPlayer(player2.player_id);

      const socket1 = this.battleGateway.getSocketByPlayerId(player1.player_id.toString());
      const socket2 = this.battleGateway.getSocketByPlayerId(player2.player_id.toString());

      if (socket1) {
        this.battleGateway.handleStartBattle(socket1, { playerId: player1.player_id });
      }
      if (socket2) {
        this.battleGateway.handleStartBattle(socket2, { playerId: player2.player_id });
      }

      console.log(`Starting battle between ${player1.player_id} and ${player2.player_id} in arena ${arenaId}`);
    }

    if (playerCount > evenCount) {
      const lastPlayer = players[playerCount - 1];
      console.log(`Player ${lastPlayer.player_id} left without opponent, starting battle vs bot.`);

      await this.matchmakingService.addPlayer(lastPlayer.player_id);

      const socket = this.battleGateway.getSocketByPlayerId(lastPlayer.player_id.toString());
      if (socket) {
        await this.startBattleVsBot(lastPlayer, socket, arenaId);
      }
    }
  }

  private async startBattleVsBot(player: any, socket: any, arenaId: string) {
    const bot = {
      player_id: 'BOT',
      username: 'Bot',
    };

    console.log(`Iniciando batalha do player ${player.player_id} contra o bot na arena ${arenaId}.`);
      this.battleGateway.handleStartBattle(
        socket,
        { playerId: player.player_id, opponent: bot, isBot: true, arenaId },
      );

    setTimeout(() => {
      console.log(`Bot atacando o player ${player.player_id} na arena ${arenaId}`);
      this.battleGateway.handleAttack(
        { playerId: bot.player_id, targetId: player.player_id, isBot: true, arenaId },
        socket,
      );
    }, 5000);
  }
}
