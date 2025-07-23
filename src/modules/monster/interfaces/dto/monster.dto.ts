export class MonsterDto {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  special: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<MonsterDto>) {
    Object.assign(this, partial);
  }
}
