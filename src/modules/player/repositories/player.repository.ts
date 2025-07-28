import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Player } from '@prisma/client';

@Injectable()
export class PlayerRepository {
  private readonly prisma = new PrismaClient();

  async create(username: string, wins = 0, losses = 0): Promise<Player> {
    return this.prisma.player.create({
      data: {
        username,
        wins,
        losses,
      },
    });
  }

  async findById(id: number): Promise<Player | null> {
    return this.prisma.player.findUnique({
      where: { id },
    });
  }

  async findByName(username: string): Promise<Player | null> {
    return this.prisma.player.findFirst({
      where: { username },
    });
  }

  async findAll(): Promise<Player[]> {
    return this.prisma.player.findMany();
  }

  async update(id: number, username?: string): Promise<Player> {
    const player = await this.findById(id);
    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }

    return this.prisma.player.update({
      where: { id },
      data: {
        ...(username && { username }),
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

  async updateStats(id: number, stats: { wins?: number; losses?: number }): Promise<void> {
    await this.prisma.player.update({
      where: { id: Number(id) },
      data: {
        ...(stats.wins !== undefined && {
          wins: {
            increment: stats.wins
          }
        }),
        ...(stats.losses !== undefined && {
          losses: {
            increment: stats.losses
          }
        }),
      },
    });
  }
}
