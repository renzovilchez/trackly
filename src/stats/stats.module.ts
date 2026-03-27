import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from './stat.entity';
import { Link } from '../links/links.entity';

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports: [TypeOrmModule.forFeature([Link, Stat])],
  exports: [StatsService],
})
export class StatsModule {}
