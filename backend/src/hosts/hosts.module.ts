import { Module } from '@nestjs/common';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';
import { HostsRepository } from './hosts.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HostsController],
  providers: [HostsService, HostsRepository],
})
export class HostsModule {}
