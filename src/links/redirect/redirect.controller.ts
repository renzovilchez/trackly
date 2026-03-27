import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Redirect,
  Req,
} from '@nestjs/common';
import { LinksService } from '../links.service';
import { StatsService } from '../../stats/stats.service';
import type { Request } from 'express';

@Controller()
export class RedirectController {
  constructor(
    private readonly linksService: LinksService,
    private readonly statsService: StatsService,
  ) {}

  @Get(':slug')
  @Redirect()
  async redirectLink(@Req() req: Request, @Param('slug') slug: string) {
    const link = await this.linksService.findBySlug(slug);
    if (!link) throw new NotFoundException('Link not found');

    const ip = req.ip ? req.ip.split(',')[0].trim() : '';
    await this.statsService.createStat(ip, link.id);

    return { url: link.url, statusCode: 302 };
  }
}
