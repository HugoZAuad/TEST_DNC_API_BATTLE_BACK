import { BattleStatsService } from '../battle-stats.service';

describe('BattleStatsService', () => {
  let service: BattleStatsService;

  beforeEach(() => {
    service = new BattleStatsService();
  });

  it('should initialize stats for a new player', async () => {
    const stats = await service.getStats('player1');
    expect(stats).toEqual({ victories: 0, defeats: 0, surrenders: 0 });
  });

  it('should record a victory', async () => {
    await service.recordVictory('player1');
    const stats = await service.getStats('player1');
    expect(stats.victories).toBe(1);
    expect(stats.defeats).toBe(0);
    expect(stats.surrenders).toBe(0);
  });

  it('should record a defeat', async () => {
    await service.recordDefeat('player1');
    const stats = await service.getStats('player1');
    expect(stats.defeats).toBe(1);
  });

  it('should record a surrender', async () => {
    await service.recordSurrender('player1');
    const stats = await service.getStats('player1');
    expect(stats.surrenders).toBe(1);
  });

  it('should accumulate multiple stats', async () => {
    await service.recordVictory('player1');
    await service.recordVictory('player1');
    await service.recordDefeat('player1');
    await service.recordSurrender('player1');
    await service.recordSurrender('player1');

    const stats = await service.getStats('player1');
    expect(stats).toEqual({ victories: 2, defeats: 1, surrenders: 2 });
  });
});
