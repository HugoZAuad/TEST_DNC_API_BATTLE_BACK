import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { MonsterCreationService } from '../services/monster-creation.service'
import { MonsterQueryService } from '../services/monster-query.service'
import { MonsterUpdateService } from '../services/monster-update.service'
import { MonsterDeleteService } from '../services/monster-delete.service'
import { CreateMonsterDto } from '../interfaces/dto/create-monster.dto'
import { UpdateMonsterNameDto } from '../interfaces/dto/update-monster.dto'
import { MonsterDto } from '../interfaces/dto/monster.dto'
import { Monster } from '@prisma/client'

@Controller('monsters')
export class MonsterController {
  constructor(
    private readonly monsterCreationService: MonsterCreationService,
    private readonly monsterQueryService: MonsterQueryService,
    private readonly monsterUpdateService: MonsterUpdateService,
    private readonly monsterDeleteService: MonsterDeleteService,
  ) { }

  @Get()
  async findAll(): Promise<MonsterDto[]> {
    const monsters = await this.monsterQueryService.findAll()
    return monsters.map(monster => new MonsterDto(monster))
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<MonsterDto> {
    const monster = await this.monsterQueryService.findById(id)
    if (!monster) {
      throw new HttpException('Monstro não encontrado', HttpStatus.NOT_FOUND)
    }
    return new MonsterDto(monster)
  }

  @Post()
  async create(@Body() createMonsterDto: CreateMonsterDto): Promise<MonsterDto> {
    try {
      const monster = await this.monsterCreationService.create(createMonsterDto)
      return new MonsterDto(monster)
    } catch (error) {
      throw new HttpException(`Erro ao criar monstro: ${error.message}`, HttpStatus.BAD_REQUEST)
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateMonsterNameDto,
  ): Promise<MonsterDto> {
    try {
      const monster: Monster = await this.monsterUpdateService.update(id, updateData)
      return new MonsterDto(monster)
    } catch (error) {
      throw new HttpException(`Erro ao atualizar monstro: ${error.message}`, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.monsterDeleteService.delete(id)
    } catch (error) {
      throw new HttpException(`Erro ao deletar monstro: ${error.message}`, HttpStatus.BAD_REQUEST)
    }
  }
}
