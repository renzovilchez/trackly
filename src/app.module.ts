import { Module } from '@nestjs/common';
import { LinksModule } from './links/links.module';
import { StatsModule } from './stats/stats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './links/links.entity';
import { Stat } from './stats/stat.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    LinksModule,
    StatsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          url: config.get('DATABASE_URL'),

          ssl: isProd ? { rejectUnauthorized: false } : false,

          entities: [Link, Stat],
          synchronize: false,
          migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
          migrationsRun: true,

          extra: {
            max: parseInt(config.get('DB_POOL_MAX', isProd ? '20' : '10'), 10),
            min: parseInt(config.get('DB_POOL_MIN', isProd ? '5' : '2'), 10),
            acquireTimeoutMillis: 3000,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          },

          logging: isProd ? ['error'] : ['query', 'error'],
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
      inject: [ConfigService],
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => [
        {
          ttl: parseInt(config.get('THROTTLE_TTL', '60000'), 10),
          limit: parseInt(config.get('THROTTLE_LIMIT', '30'), 10),
        },
      ],
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
