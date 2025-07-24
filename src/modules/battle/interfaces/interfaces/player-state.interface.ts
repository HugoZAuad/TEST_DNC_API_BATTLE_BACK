export interface PlayerState {
  playerId: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  specialAbility: string;
  isBot: boolean;
  specialActive?: boolean;
  specialCooldown?: number;
}
