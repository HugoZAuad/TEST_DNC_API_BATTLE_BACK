import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Player } from '@prisma/client';

@Injectable()
export class PlayerRepository {
  private prisma = new PrismaClient();

  async create(username: string): Promise<Player> {
    return this.prisma.player.create({
      data: {
        username,
      },
    });
  }

  async findById(id: number): Promise<Player | null> {
    return this.prisma.player.findUnique({ where: { id } });
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
}
