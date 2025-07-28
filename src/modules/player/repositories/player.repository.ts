import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Player } from '@prisma/client';

@Injectable()
export class PlayerRepository {
  private readonly prisma = new PrismaClient();

  async create(name: string, winners = 0, losses = 0): Promise<Player> {
    return this.prisma.player.create({
      data: {
        username: name,
        winners,
        losses,
      },
    });
  }

  async findById(id: number): Promise<Player | null> {
    return this.prisma.player.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Player | null> {
    return this.prisma.player.findFirst({
      where: { username: name },
    });
  }

  async findAll(): Promise<Player[]> {
    return this.prisma.player.findMany();
  }

  async update(id: number, name?: string): Promise<Player> {
    const player = await this.findById(id);
    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }

    return this.prisma.player.update({
      where: { id },
      data: {
        ...(name && { name }),
      },
    });
  }

  async delete(id: number): Promise<void> {
    const player = await this.findById(id);
    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }

    await this.prisma.player.delete({
      where: { id },
    });
  }

  async updateStats(
    id: number,
    stats: { winners?: number; losses?: number }
  ): Promise<void> {
    await this.prisma.player.update({
      where: { id: Number(id) },
      data: {
        ...(stats.winners !== undefined && {
          winners: {
            increment: stats.winners,
          },
        }),
        ...(stats.losses !== undefined && {
          losses: {
            increment: stats.losses,
          },
        }),
      },
    });
  }
}
