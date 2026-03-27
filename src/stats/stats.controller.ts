import { Controller, Get, Headers, Param, ParseIntPipe } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Stat } from './stat.entity';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get(':linkId')
  getStats(@Param('linkId', ParseIntPipe) linkId: number): Promise<Stat[]> {
    return this.statsService.getStats(linkId);
  }
}
