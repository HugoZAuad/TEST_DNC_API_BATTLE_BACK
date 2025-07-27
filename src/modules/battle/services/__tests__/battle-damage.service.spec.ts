import { Test, TestingModule } from '@nestjs/testing';
import { BattleDamageService } from '../battle-damage.service';
import { BattleRepository } from '../../repositories/battle.repository';

describe('BattleDamageService', () => {
  let service: BattleDamageService;
  let battleRepository: BattleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleDamageService,
        {
          provide: BattleRepository,
          useValue: {
            applyDamage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BattleDamageService>(BattleDamageService);
    battleRepository = module.get<BattleRepository>(BattleRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should apply damage correctly', async () => {
    const attacker = { attack: 50 };
    const defender = { defense: 20, hp: 100 };
    const result = await service.calculateDamage(attacker, defender);
    expect(result).toBeGreaterThan(0);
  });
});
