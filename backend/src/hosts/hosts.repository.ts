import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HostCreateDto, HostUpdateDto } from './dto';

@Injectable()
export class HostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: string) {
    return this.prisma.host.findMany({
      where: {
        OR: query
          ? [
              { address: { contains: query, mode: 'insensitive' } },
              { alias: { contains: query, mode: 'insensitive' } },
              { username: { contains: query, mode: 'insensitive' } },
              { password: { contains: query, mode: 'insensitive' } },
              {
                port: Number.isInteger(Number(query))
                  ? { equals: Number(query) }
                  : undefined,
              },
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
              { alias: { contains: query, mode: 'insensitive' } },
              { username: { contains: query, mode: 'insensitive' } },
              { password: { contains: query, mode: 'insensitive' } },
              {
                port: Number.isInteger(Number(query))
                  ? { equals: Number(query) }
                  : undefined,
              },
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

  async update(id: number, host: HostUpdateDto) {
    try {
      return this.prisma.host.update({
        where: { id },
        data: host,
      });
    } catch (error) {
      throw new NotFoundException('Host not found');
    }
  }
}
