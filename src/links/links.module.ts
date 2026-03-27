import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { RedirectController } from './redirect/redirect.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './links.entity';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  controllers: [LinksController, RedirectController],
  providers: [LinksService],
  imports: [TypeOrmModule.forFeature([Link]), StatsModule],
})
export class LinksModule {}
