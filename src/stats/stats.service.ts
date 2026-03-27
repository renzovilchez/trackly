import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stat } from './stat.entity';
import { Link } from '../links/links.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stat)
    private readonly statRepository: Repository<Stat>,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async getStats(linkId: number): Promise<Stat[]> {
    return this.statRepository.find({ where: { link: { id: linkId } } });
  }

  async createStat(ip: string, linkId: number): Promise<Stat> {
    const link = await this.linkRepository.findOne({ where: { id: linkId } });
    if (!link) {
      throw new NotFoundException('Link no encontrado');
    }
    const stat = await this.statRepository.save({
      ipAddress: ip,
      link,
    });
    return stat;
  }
}
