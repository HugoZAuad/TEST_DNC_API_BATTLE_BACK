import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient, Monster } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class MonsterRepository {
  async findAll(): Promise<Monster[]> {
    try {
      return await prisma.monster.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch monsters');
    }
  }

  async findById(id: number): Promise<Monster | null> {
    try {
      return await prisma.monster.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch monster by id');
    }
  }

  async findByName(name: string): Promise<Monster | null> {
    try {
      return await prisma.monster.findFirst({
        where: { name },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch monster by name');
    }
  }

  async findByPlayerId(playerId: number): Promise<Monster[]> {
    try {
      return await prisma.monster.findMany({
        where: { playerId },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch monsters by player id');
    }
  }

  async create(
    data: {
      name: string;
      hp: number;
      attack: number;
      defense: number;
      speed: number;
      specialAbility: string;
    },
    playerId: number,
  ): Promise<Monster> {
    try {
      return await prisma.monster.create({
        data: {
          ...data,
          playerId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create monster');
    }
  }

  async update(
    id: number,
    data: Partial<Omit<Monster, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Monster> {
    try {
      return await prisma.monster.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update monster');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.monster.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete monster');
    }
  }
}
