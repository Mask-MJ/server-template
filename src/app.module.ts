import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { LogsModule } from './common/logger/logs.module';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { CustomPrismaModule } from 'nestjs-prisma';
import { extendedPrismaClient } from './common/datebase/prisma.extension';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { SystemModule } from './modules/system/system.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { AssistantModule } from './modules/assistant/assistant.module';
@Module({
  imports: [
    ConfigModule,
    LogsModule,
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        const REDIS_HOST = configService.get<string>('REDIS_HOST');
        const REDIS_PORT = configService.get<number>('REDIS_PORT');
        const REDIS_PASSWORD = configService.get<string>('REDIS_PASSWORD');
        return {
          stores: [
            createKeyv({
              url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
              password: REDIS_PASSWORD,
            }),
          ],
        };
      },
    }),
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: 'PrismaService',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const DATABASE_PORT = configService.get<number>('DATABASE_PORT');
        const DATABASE_HOST = configService.get<string>('DATABASE_HOST');
        const DATABASE_USER = configService.get<string>('DATABASE_USER');
        const DATABASE_PASSWORD =
          configService.get<string>('DATABASE_PASSWORD');
        const DATABASE_DB = configService.get<string>('DATABASE_DB');
        const datasourceUrl = `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_DB}`;
        return extendedPrismaClient({ datasourceUrl });
      },
    }),
    EventEmitterModule.forRoot(),
    RouterModule.register([
      { path: 'system', module: SystemModule },
      { path: 'monitor', module: MonitorModule },
      { path: 'auth', module: AuthModule },
    ]),
    AuthModule,
    SystemModule,
    MonitorModule,
    KnowledgeBaseModule,
    AssistantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
