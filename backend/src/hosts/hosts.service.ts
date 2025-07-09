import { Injectable } from '@nestjs/common';
import { HostsRepository } from './hosts.repository';
import { HostCreateDto, HostUpdateDto } from './dto';

@Injectable()
export class HostsService {
  constructor(private readonly hostsRepository: HostsRepository) {}

  async findAll(query: string) {
    const [data, count] = await Promise.all([
      this.hostsRepository.findAll(query),
      this.hostsRepository.count(query),
    ]);

    return { data, count };
  }

  async create(host: HostCreateDto) {
    return this.hostsRepository.create(host);
  }

  async delete(id: number) {
    return this.hostsRepository.delete(id);
  }

  async update(id: number, host: HostUpdateDto) {
    return this.hostsRepository.update(id, host);
  }
}
