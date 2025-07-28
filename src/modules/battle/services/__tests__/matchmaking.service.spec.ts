import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingService } from '../matchmaking.service';
import { PlayerState } from '../../interfaces/interfaces/player-state.interface';

describe('MatchmakingService', () => {
  let service: MatchmakingService;

  const bots: PlayerState[] = [
    {
      playerId: 'bot1',
      hp: 100,
      attack: 15,
      defense: 5,
      speed: 10,
      specialAbility: 'Fireball',
      isBot: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchmakingService],
    }).compile();

    service = module.get<MatchmakingService>(MatchmakingService);
  });

  it('should add player to waiting list', () => {
    const player: PlayerState = {
      playerId: 'player1',
      hp: 100,
      attack: 10,
      defense: 5,
      speed: 10,
      specialAbility: 'None',
      isBot: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    service.addPlayer(player);
    expect(service['waitingPlayers']).toContain(player);
  });

  it('should return two players if two or more waiting', () => {
    const player1: PlayerState = {
      playerId: 'player1',
      hp: 100,
      attack: 10,
      defense: 5,
      speed: 10,
      specialAbility: 'None',
      isBot: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const player2: PlayerState = {
      playerId: 'player2',
      hp: 100,
      attack: 12,
      defense: 6,
      speed: 11,
      specialAbility: 'None',
      isBot: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    service.addPlayer(player1);
    service.addPlayer(player2);
    const match = service.getMatch();
    expect(match).toHaveLength(2);
    expect(match).toContain(player1);
    expect(match).toContain(player2);
  });

  it('should return one player and one bot if only one player waiting', () => {
    const player1: PlayerState = {
      playerId: 'player1',
      hp: 100,
      attack: 10,
      defense: 5,
      speed: 10,
      specialAbility: 'None',
      isBot: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    service.addPlayer(player1);
    const match = service.getMatch();
    expect(match).not.toBeNull();
    expect(match).toHaveLength(2);
    expect(match).toContain(player1);
    expect(match!.some(p => p.isBot)).toBe(true);
  });

  it('should return null if no players waiting', () => {
    const match = service.getMatch();
    expect(match).toBeNull();
  });
});
