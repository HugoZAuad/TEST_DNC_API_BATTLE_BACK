import { BattleDamageService } from '../battle-damage.service';

describe('BattleDamageService', () => {
  let service: BattleDamageService;

  beforeEach(() => {
    service = new BattleDamageService();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve calcular dano corretamente quando ataque é maior que defesa', () => {
    const damage = service.calculateDamage(10, 5);
    expect(damage).toBe(5);
  });

  it('deve retornar dano mínimo 1 quando ataque é menor ou igual a defesa', () => {
    expect(service.calculateDamage(5, 10)).toBe(1);
    expect(service.calculateDamage(5, 5)).toBe(1);
  });
});
