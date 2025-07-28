import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Player } from '@prisma/client';

@Injectable()
export class PlayerRepository {
  private prisma = new PrismaClient();

  async create(username: string, wins: number = 0, losses: number = 0): Promise<Player> {
    return this.prisma.player.create({
      data: {
        username,
      },
    });
  }

  async findById(id: number): Promise<Player | null> {
    return this.prisma.player.findUnique({ where: { id } });
  }

  async findByName(username: string): Promise<Player | null> {
    return this.prisma.player.findFirst({ where: { username } });
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
        ...(username !== undefined && { username }),
      },
    });
  }

  async delete(id: number): Promise<void> {
    const player = await this.findById(id);
    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }
    await this.prisma.player.delete({ where: { id } });
  }

  async updateStats(id: string, stats: { wins?: number; losses?: number }): Promise<void> {
    const playerId = parseInt(id);
    const player = await this.findById(playerId);
    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }

    await this.prisma.player.update({
      where: { id: playerId },
      data: {
        wins: (player.wins ?? 0) + (stats.wins ?? 0),
        losses: (player.losses ?? 0) + (stats.losses ?? 0),
      },
    });
  }
}
