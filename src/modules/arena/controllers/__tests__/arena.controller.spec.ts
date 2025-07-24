import { Test, TestingModule } from '@nestjs/testing';
import { ArenaController } from '../arena.controller';
import { ArenaCreationService } from '../../services/arena-creation.service';
import { ArenaActionService } from '../../services/arena-action.service';
import { ArenaJoinService } from '../../services/arena-join.service';
import { ArenaLeaveService } from '../../services/arena-leave.service';
import { ArenaStartService } from '../../services/arena-start.service';
import { ArenaEndService } from '../../services/arena-end.service';

describe('ArenaController', () => {
  let controller: ArenaController;

  const mockArenaCreationService = {
    createArena: jest.fn(),
  };
  const mockArenaActionService = {
    playerAction: jest.fn(),
  };
  const mockArenaJoinService = {
    joinArena: jest.fn(),
  };
  const mockArenaLeaveService = {
    leaveArena: jest.fn(),
  };
  const mockArenaStartService = {
    startBattle: jest.fn(),
  };
  const mockArenaEndService = {
    endBattle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArenaController],
      providers: [
        { provide: ArenaCreationService, useValue: mockArenaCreationService },
        { provide: ArenaActionService, useValue: mockArenaActionService },
        { provide: ArenaJoinService, useValue: mockArenaJoinService },
        { provide: ArenaLeaveService, useValue: mockArenaLeaveService },
        { provide: ArenaStartService, useValue: mockArenaStartService },
        { provide: ArenaEndService, useValue: mockArenaEndService },
      ],
    }).compile();

    controller = module.get<ArenaController>(ArenaController);
  });

  it('deve criar uma arena', () => {
    const dto = { name: 'Arena1', max_players: 4 };
    const result = { id: '1', name: 'Arena1', maxPlayers: 4, players: [] };
    mockArenaCreationService.createArena.mockReturnValue(result);

    expect(controller.createArena(dto)).toEqual(result);
    expect(mockArenaCreationService.createArena).toHaveBeenCalledWith(dto);
  });

  it('deve processar a ação do jogador', () => {
    const id = '1';
    const body = { player_id: 1, action: 'attack' };
    const result = { message: 'Action processed' };
    mockArenaActionService.playerAction.mockReturnValue(result);

    expect(controller.playerAction(id, body)).toEqual(result);
    expect(mockArenaActionService.playerAction).toHaveBeenCalledWith(id, body);
  });

  it('deve permitir jogador entrar na arena', () => {
    const id = '1';
    const body = { player_id: 1, monster_id: 2 };
    const result = { message: 'Joined' };
    mockArenaJoinService.joinArena.mockReturnValue(result);

    expect(controller.joinArena(id, body)).toEqual(result);
    expect(mockArenaJoinService.joinArena).toHaveBeenCalledWith(id, body);
  });

  it('deve permitir jogador sair da arena', () => {
    const id = '1';
    const body = { player_id: 1 };
    const result = { message: 'Left' };
    mockArenaLeaveService.leaveArena.mockReturnValue(result);

    expect(controller.leaveArena(id, body)).toEqual(result);
    expect(mockArenaLeaveService.leaveArena).toHaveBeenCalledWith(id, body);
  });

  it('deve iniciar a batalha', () => {
    const id = '1';
    const result = { message: 'Battle started' };
    mockArenaStartService.startBattle.mockReturnValue(result);

    expect(controller.startBattle(id)).toEqual(result);
    expect(mockArenaStartService.startBattle).toHaveBeenCalledWith(id);
  });

  it('deve finalizar a batalha', () => {
    const id = '1';
    const body = { winner: { player_id: 1, monster: 'monster1' } };
    const result = { message: 'Battle ended' };
    mockArenaEndService.endBattle.mockReturnValue(result);

    expect(controller.endBattle(id, body)).toEqual(result);
    expect(mockArenaEndService.endBattle).toHaveBeenCalledWith(id, body);
  });
});
