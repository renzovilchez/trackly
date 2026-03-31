import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from './stat.entity';

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports: [TypeOrmModule.forFeature([Stat])],
  exports: [StatsService],
})
export class StatsModule {}
