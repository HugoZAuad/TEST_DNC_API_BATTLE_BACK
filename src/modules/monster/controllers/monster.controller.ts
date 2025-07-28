import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { MonsterCreationService } from '../services/monster-creation.service';
import { MonsterUpdateService } from '../services/monster-update.service';
import { MonsterDeleteService } from '../services/monster-delete.service';
import { MonsterFindAllService } from '../services/monster-find-all.service';
import { MonsterFindByIdService } from '../services/monster-find-by-id.service';
import { MonsterFindByNameService } from '../services/monster-find-by-name.service';
import { CreateMonsterDto } from '../interfaces/dto/create-monster.dto';
import { UpdateMonsterNameDto } from '../interfaces/dto/update-monster.dto';

@Controller('monsters')
export class MonsterController {
  constructor(
    private readonly monsterCreationService: MonsterCreationService,
    private readonly monsterUpdateService: MonsterUpdateService,
    private readonly monsterDeleteService: MonsterDeleteService,
    private readonly monsterFindAllService: MonsterFindAllService,
    private readonly monsterFindByIdService: MonsterFindByIdService,
    private readonly monsterFindByNameService: MonsterFindByNameService,
  ) {}

  @Post()
  async createMonster(@Body() createMonsterDto: CreateMonsterDto): Promise<any> {
    const playerId = 1;
    return await this.monsterCreationService.create(createMonsterDto, playerId);
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.monsterFindAllService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.monsterFindByIdService.findById(id);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<any> {
    return await this.monsterFindByNameService.findByName(name);
  }

  @Patch(':id')
  async updateMonster(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMonsterDto: UpdateMonsterNameDto,
  ): Promise<any> {
    return await this.monsterUpdateService.update(id, updateMonsterDto);
  }

  @Delete(':id')
  async deleteMonster(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.monsterDeleteService.delete(id);
    return { message: 'Monstro deletado com sucesso' };
  }
}
