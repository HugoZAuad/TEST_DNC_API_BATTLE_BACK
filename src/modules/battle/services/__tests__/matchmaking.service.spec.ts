import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingService } from '../matchmaking.service';
import { PlayerState } from '../../interfaces/interfaces/player-state.interface';

describe('MatchmakingService', () => {
  let service: MatchmakingService;

  const createPlayer = (id: string): PlayerState => ({
    playerId: id,
    username: `Player ${id}`,
    hp: 100,
    attack: 10,
    defense: 5,
    speed: 10,
    specialAbility: 'None',
    isBot: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchmakingService],
    }).compile();

    service = module.get<MatchmakingService>(MatchmakingService);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should add player to waiting list', () => {
    const player = createPlayer('1');
    service.addPlayer(player);
    const waiting = (service as any).waitingPlayers;
    expect(waiting.length).toBe(1);
    expect(waiting[0].player).toEqual(player);
  });

  it('should return two players if two or more waiting', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');
    service.addPlayer(player1);
    service.addPlayer(player2);
    const match = service.getMatch();
    expect(match).toHaveLength(2);
    expect(match).toContain(player1);
    expect(match).toContain(player2);
  });

  it('should return one player and one bot if only one player waiting and timeout passed', () => {
    const player1 = createPlayer('1');
    service.addPlayer(player1);
    jest.advanceTimersByTime(10000); // 10s timeout
    const match = service.getMatch();
    expect(match).not.toBeNull();
    expect(match).toHaveLength(2);
    expect(match).toContain(player1);
    expect(match!.some(p => p.isBot)).toBe(true);
  });

  it('should return null if only one player waiting and timeout not passed', () => {
    const player1 = createPlayer('1');
    service.addPlayer(player1);
    jest.advanceTimersByTime(5000); // less than timeout
    const match = service.getMatch();
    expect(match).toBeNull();
  });

  it('should return null if no players waiting', () => {
    const match = service.getMatch();
    expect(match).toBeNull();
  });

  it('should clean up expired players after 60s', () => {
    const player1 = createPlayer('1');
    service.addPlayer(player1);
    jest.advanceTimersByTime(61000); // 61s
    service.getMatch(); // triggers cleanup
    const waiting = (service as any).waitingPlayers;
    expect(waiting.length).toBe(0);
  });
});
