import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Users from './Users';
import Assets from './Assets';

@Entity('closedtrades')
class ClosedTrades {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column()
  asset_id: string;

  @ManyToOne(() => Assets, asset => asset.closedtrade, { eager: true })
  @JoinColumn({ name: 'asset_id' })
  asset: Assets;

  @Column()
  total_invested: number;

  @Column()
  profit: number;

  @UpdateDateColumn()
  created_at: Date;
}

export default ClosedTrades;
