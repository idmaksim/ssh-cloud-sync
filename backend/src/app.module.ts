import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HostsModule } from './hosts/hosts.module';
import config from './config/config';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    HostsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
