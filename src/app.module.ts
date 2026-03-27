import { Module } from '@nestjs/common';
import { LinksModule } from './links/links.module';
import { StatsModule } from './stats/stats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './links/links.entity';
import { Stat } from './stats/stat.entity';

@Module({
  imports: [
    LinksModule,
    StatsModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'trackly.db',
      entities: [Link, Stat],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
