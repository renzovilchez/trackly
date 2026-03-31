import { Stat } from '../stats/stat.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Stat, (stat) => stat.link, {
    cascade: ['insert', 'update'],
  })
  stats: Stat[];
}
