import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HostCreateDto } from './dto';

@Injectable()
export class HostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: string) {
    return this.prisma.host.findMany({
      where: {
        OR: query
          ? [
              { address: { contains: query, mode: 'insensitive' } },
              { password: { contains: query, mode: 'insensitive' } },
              { sshKey: { contains: query, mode: 'insensitive' } },
              { port: { equals: Number(query) } },
            ]
          : undefined,
      },
    });
  }

  async count(query: string) {
    return this.prisma.host.count({
      where: {
        OR: query
          ? [
              { address: { contains: query, mode: 'insensitive' } },
              { password: { contains: query, mode: 'insensitive' } },
              { sshKey: { contains: query, mode: 'insensitive' } },
              { port: { equals: Number(query) } },
            ]
          : undefined,
      },
    });
  }

  async create(host: HostCreateDto) {
    return this.prisma.host.create({
      data: host,
    });
  }

  async delete(id: number) {
    try {
      return this.prisma.host.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Host not found');
    }
  }
}
