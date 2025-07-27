import { Injectable } from '@nestjs/common';

@Injectable()
export class BattleDamageService {
  async calculateDamage(
    attacker: { attack: number },
    defender: { defense: number; hp: number },
  ): Promise<number> {
    let baseDamage = attacker.attack - defender.defense;
    baseDamage = Math.max(baseDamage, 1);
    const isCritical = Math.random() < 0.1;
    const criticalMultiplier = isCritical ? 2 : 1;
    const finalDamage = Math.floor(baseDamage * criticalMultiplier);
    return finalDamage;
  }
}
