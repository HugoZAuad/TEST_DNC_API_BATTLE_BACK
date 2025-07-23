import { Injectable } from '@nestjs/common';
import { BattleState } from '../interfaces/interfaces/battle-state.interface';

@Injectable()
export class BattleTurnService {
  isPlayerTurn(battleState: BattleState, playerId: string): boolean {
    return battleState.currentTurnPlayerId === playerId;
  }

  switchTurn(battleState: BattleState): BattleState {
    const currentPlayerIndex = battleState.players.findIndex(
      (p) => p.playerId === battleState.currentTurnPlayerId,
    );
    const nextPlayerIndex = (currentPlayerIndex + 1) % battleState.players.length;
    battleState.currentTurnPlayerId = battleState.players[nextPlayerIndex].playerId;
    return battleState;
  }
}
