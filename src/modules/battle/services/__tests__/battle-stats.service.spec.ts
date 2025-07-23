import { BattleStatsService } from '../battle-stats.service';

describe('BattleStatsService', () => {
  let service: BattleStatsService;

  beforeEach(() => {
    service = new BattleStatsService();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve inicializar estatísticas para um jogador', () => {
    const stats = service.getStats('player1');
    expect(stats).toEqual({ victories: 0, defeats: 0, surrenders: 0 });
  });

  it('deve registrar vitória corretamente', () => {
    service.recordVictory('player1');
    const stats = service.getStats('player1');
    expect(stats?.victories).toBe(1);
  });

  it('deve registrar derrota corretamente', () => {
    service.recordDefeat('player1');
    const stats = service.getStats('player1');
    expect(stats?.defeats).toBe(1);
  });

  it('deve registrar rendição corretamente', () => {
    service.recordSurrender('player1');
    const stats = service.getStats('player1');
    expect(stats?.surrenders).toBe(1);
  });
});
