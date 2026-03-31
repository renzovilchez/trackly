import { Link } from '../links/links.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import * as crypto from 'crypto';

@Entity()
export class Stat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Link, (link) => link.stats, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @Index()
  link: Link;

  @Column({ type: 'varchar' })
  ipHash: string;

  @Column({ type: 'varchar', nullable: true })
  browser: string | null;

  @Column({ type: 'varchar', nullable: true })
  refererDomain: string | null;

  @CreateDateColumn()
  clickedAt: Date;

  static hashIp(ip: string): string {
    const salt = process.env.IP_SALT || 'random-salt-change-in-production';
    return crypto
      .createHash('sha256')
      .update(ip + salt)
      .digest('hex')
      .substring(0, 16);
  }
}
