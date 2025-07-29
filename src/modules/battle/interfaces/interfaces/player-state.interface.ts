export interface PlayerState {
  playerId: string;
  username: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  specialAbility: string;
  isBot: boolean;
  createdAt: Date;
  updatedAt: Date;
}
