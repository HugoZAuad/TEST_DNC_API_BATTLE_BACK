import { Injectable } from '@nestjs/common';
import { PrismaClient, Monster } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class MonsterRepository {
  async findAll(): Promise<Monster[]> {
    return prisma.monster.findMany();
  }

  async findById(id: number): Promise<Monster | null> {
    return prisma.monster.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    specialAbility: string;
  }): Promise<Monster> {
    return prisma.monster.create({
      data,
    });
  }

  async update(id: number, data: Partial<Omit<Monster, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Monster> {
    return prisma.monster.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.monster.delete({
      where: { id },
    });
  }
}
