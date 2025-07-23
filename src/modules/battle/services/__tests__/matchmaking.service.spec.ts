import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingService } from '../matchmaking.service';
import { BattleRepository } from '../../repositories/battle.repository';
import { PlayerRepository } from '../../../player/repositories/player.repository';
import { MonsterRepository } from '../../../monster/repositories/monster.repository';
import { BattleGateway } from '../../gateway/battle.gateway';
import { Socket } from 'socket.io';

describe('MatchmakingService', () => {
  let service: MatchmakingService;
  let battleRepository: BattleRepository;
  let playerRepository: PlayerRepository;
  let monsterRepository: MonsterRepository;
  let battleGateway: BattleGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchmakingService,
        {
          provide: BattleRepository,
          useValue: {
            getBots: jest.fn(),
          },
        },
        {
          provide: PlayerRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: MonsterRepository,
          useValue: {
            findByPlayerId: jest.fn(),
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
    battleRepository = module.get<BattleRepository>(BattleRepository);
    playerRepository = module.get<PlayerRepository>(PlayerRepository);
    monsterRepository = module.get<MonsterRepository>(MonsterRepository);
    battleGateway = module.get<BattleGateway>(BattleGateway);
  });

  it('deve adicionar jogador disponível se ele tiver monstro', async () => {
    (monsterRepository.findByPlayerId as jest.Mock).mockResolvedValue({ id: 1 });
    const result = await service.addPlayer(1);
    expect(result).toBe(true);
  });

  it('não deve adicionar jogador se ele não tiver monstro', async () => {
    (monsterRepository.findByPlayerId as jest.Mock).mockResolvedValue(null);
    const result = await service.addPlayer(2);
    expect(result).toBe(false);
  });

  it('deve remover jogador da lista de disponíveis', () => {
    service['availablePlayers'].add(1);
    service.removePlayer(1);
    expect(service['availablePlayers'].has(1)).toBe(false);
  });

  it('deve retornar bot se não houver jogadores disponíveis', async () => {
    (battleRepository.getBots as jest.Mock).mockReturnValue([
      { playerId: 'bot1', hp: 100, attack: 10, defense: 10, speed: 5, specialAbility: 'None', isBot: true },
    ]);
    const opponent = await service.findOpponent(1);
    expect(opponent?.isBot).toBe(true);
  });

  it('deve retornar undefined se getBots retornar undefined', async () => {
    (battleRepository.getBots as jest.Mock).mockReturnValue(undefined);
    const opponent = await service.findOpponent(1);
    expect(opponent).toBeUndefined();
  });

  it('deve retornar jogador disponível como oponente', async () => {
    service['availablePlayers'].add(1);
    service['availablePlayers'].add(2);
    (playerRepository.findById as jest.Mock).mockResolvedValue({ id: 2 });
    (monsterRepository.findByPlayerId as jest.Mock).mockResolvedValue({
      hp: 100,
      attack: 10,
      defense: 10,
      speed: 5,
      specialAbility: 'None',
    });
    const opponent = await service.findOpponent(1);
    expect(opponent?.playerId).toBe('2');
    expect(opponent?.isBot).toBe(false);
  });

  it('deve remover jogador inválido, enviar erro e buscar outro oponente', async () => {
    service['availablePlayers'].add(1);
    service['availablePlayers'].add(2);

    // Primeiro retorno: jogador inválido
    (playerRepository.findById as jest.Mock).mockResolvedValueOnce(null);
    (monsterRepository.findByPlayerId as jest.Mock).mockResolvedValueOnce(null);

    // Segundo retorno: jogador válido
    (playerRepository.findById as jest.Mock).mockResolvedValueOnce({ id: 2 });
    (monsterRepository.findByPlayerId as jest.Mock).mockResolvedValueOnce({
      hp: 100,
      attack: 10,
      defense: 10,
      speed: 5,
      specialAbility: 'None',
    });

    const mockSocket = { emit: jest.fn() } as unknown as Socket;
    (battleGateway.getSocketByPlayerId as jest.Mock).mockReturnValue(mockSocket);

    const opponent = await service.findOpponent(1);

    expect(battleGateway.getSocketByPlayerId).toHaveBeenCalledWith('2');
    expect(battleGateway.sendErrorMessage).toHaveBeenCalledWith(mockSocket, expect.stringContaining('A partida deu erro'));
    expect(opponent?.playerId).toBe('2');
  });
});
