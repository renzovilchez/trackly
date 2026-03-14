import { Module } from '@nestjs/common';
import { LinksModule } from './links/links.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [LinksModule, StatsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
