import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('links')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get(':id/stats')
  async getStatsSummary(@Param('id', ParseIntPipe) linkId: number) {
    return this.statsService.getStatsSummary(linkId);
  }
}
