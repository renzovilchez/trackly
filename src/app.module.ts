import { Module } from '@nestjs/common';
import { LinksModule } from './links/links.module';
import { StatsModule } from './stats/stats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './links/links.entity';
import { Stat } from './stats/stat.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    LinksModule,
    StatsModule,
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          url: config.get('DATABASE_URL'),
          ssl:
            config.get('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false,
          entities: [Link, Stat],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
