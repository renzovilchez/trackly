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

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '';
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] || '';

    await this.statsService.createStat({
      ip,
      userAgent,
      referer,
      linkId: link.id,
    });

    return { url: link.url, statusCode: 302 };
  }
}
