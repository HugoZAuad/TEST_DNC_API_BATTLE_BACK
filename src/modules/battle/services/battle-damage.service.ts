import { Injectable } from '@nestjs/common';

@Injectable()
export class BattleDamageService {
  calculateDamage(attack: number, defense: number): number {
    const damage = attack - defense;
    return damage > 0 ? damage : 1; // dano mínimo 1
  }
}
