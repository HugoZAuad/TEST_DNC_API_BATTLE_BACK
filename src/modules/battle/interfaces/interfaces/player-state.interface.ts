export interface PlayerState {
  playerId: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  specialAbility: string;
  isBot: boolean;
  createdAt: Date;
  updatedAt: Date;
}
