import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingService } from '../matchmaking.service';
import { BattleRepository } from '../../repositories/battle.repository';
import { MonsterRepository } from '../../../monster/repositories/monster.repository';
import { PlayerRepository } from '../../../player/repositories/player.repository';
import { BattleGateway } from '../../gateway/battle.gateway';

describe('MatchmakingService', () => {
  let service: MatchmakingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchmakingService,
        {
          provide: BattleRepository,
          useValue: {
            getBots: jest.fn().mockReturnValue([
              {
                playerId: 'bot1',
                hp: 100,
                attack: 30,
                defense: 20,
                speed: 10,
                specialAbility: 'fire',
                isBot: true,
              },
            ]),
          },
        },
        {
          provide: MonsterRepository,
          useValue: {
            findByPlayerId: jest.fn().mockImplementation((id) =>
              id === 1 ? [{ hp: 100, attack: 50, defense: 30, speed: 20, specialAbility: 'ice' }] : [],
            ),
          },
        },
        {
          provide: PlayerRepository,
          useValue: {
            findById: jest.fn().mockReturnValue({ id: 2 }),
          },
        },
        {
          provide: BattleGateway,
          useValue: {
            getSocketByPlayerId: jest.fn(),
            sendErrorMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchmakingService>(MatchmakingService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve adicionar jogador com monstros válidos', async () => {
    const resultado = await service.addPlayer(1);
    expect(resultado).toBe(true);
  });

  it('não deve adicionar jogador sem monstros', async () => {
    const resultado = await service.addPlayer(999);
    expect(resultado).toBe(false);
  });

  it('deve encontrar um bot como oponente se não houver jogadores disponíveis', async () => {
    const oponente = await service.findOpponent(1);
    expect(oponente).toBeDefined();
    expect(oponente?.isBot).toBe(true);
  });
});
