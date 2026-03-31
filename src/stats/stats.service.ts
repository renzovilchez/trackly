import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stat } from './stat.entity';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stat)
    private readonly statRepository: Repository<Stat>,
  ) {}

  async createStat(data: {
    ip: string;
    userAgent: string;
    referer: string;
    linkId: number;
  }): Promise<Stat> {
    const stat = this.statRepository.create({
      ipHash: Stat.hashIp(data.ip),
      browser: this.extractBrowser(data.userAgent),
      refererDomain: this.extractDomain(data.referer),
      link: { id: data.linkId },
    });

    return this.statRepository.save(stat);
  }

  async getStatsSummary(linkId: number): Promise<{
    totalClicks: number;
    uniqueVisitors: number;
    topBrowsers: { browser: string; count: number }[];
    topReferrers: { domain: string; count: number }[];
    last7Days: { date: string; clicks: number }[];
  }> {
    const totalClicks = await this.statRepository.count({
      where: { link: { id: linkId } },
    });

    const uniqueResult = await this.statRepository
      .createQueryBuilder('stat')
      .select('COUNT(DISTINCT stat.ipHash)', 'count')
      .where('stat.link = :linkId', { linkId })
      .getRawOne();
    const uniqueVisitors = parseInt(uniqueResult.count, 10);

    const topBrowsers = await this.statRepository
      .createQueryBuilder('stat')
      .select('stat.browser', 'browser')
      .addSelect('COUNT(*)', 'count')
      .where('stat.link = :linkId', { linkId })
      .andWhere('stat.browser IS NOT NULL')
      .groupBy('stat.browser')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany()
      .then((results) =>
        results.map((r) => ({
          browser: r.browser,
          count: parseInt(r.count, 10),
        })),
      );

    const topReferrers = await this.statRepository
      .createQueryBuilder('stat')
      .select('stat.refererDomain', 'domain')
      .addSelect('COUNT(*)', 'count')
      .where('stat.link = :linkId', { linkId })
      .andWhere('stat.refererDomain IS NOT NULL')
      .groupBy('stat.refererDomain')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany()
      .then((results) =>
        results.map((r) => ({
          domain: r.domain,
          count: parseInt(r.count, 10),
        })),
      );

    const last7DaysRaw = await this.statRepository
      .createQueryBuilder('stat')
      .select('DATE(stat.clickedAt)::text', 'date')
      .addSelect('COUNT(*)', 'clicks')
      .where('stat.link = :linkId', { linkId })
      .andWhere('stat.clickedAt >= :sevenDaysAgo', {
        sevenDaysAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    const last7Days = this.fillMissingDates(last7DaysRaw);

    return {
      totalClicks,
      uniqueVisitors,
      topBrowsers,
      topReferrers,
      last7Days,
    };
  }

  private fillMissingDates(
    rawData: { date: string; clicks: string }[],
  ): { date: string; clicks: number }[] {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const dataMap = new Map(
      rawData.map((d) => [d.date, parseInt(d.clicks, 10)]),
    );

    return dates.map((date) => ({
      date,
      clicks: dataMap.get(date) || 0,
    }));
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupOldStats(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.statRepository.delete({
      clickedAt: LessThan(thirtyDaysAgo),
    });

    if (result.affected && result.affected > 0) {
      console.log(`Deleted ${result.affected} old stats (GDPR cleanup)`);
    }
  }

  private extractBrowser(userAgent: string): string | null {
    if (!userAgent) return null;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private extractDomain(referer: string): string | null {
    if (!referer) return null;
    try {
      const url = new URL(referer);
      return url.hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  }
}
