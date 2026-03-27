import { Link } from '../links/links.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Stat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Link, (link) => link.stats)
  link: Link;

  @Column()
  ipAddress: string;

  @CreateDateColumn()
  clickedAt: Date;
}
