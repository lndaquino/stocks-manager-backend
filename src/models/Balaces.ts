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

@Entity('balances')
class Balances {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column()
  asset_id: string;

  @ManyToOne(() => Assets, asset => asset.balance, { eager: true })
  @JoinColumn({ name: 'asset_id' })
  asset: Assets;

  @Column()
  total_quantity: number;

  @Column()
  total_value: number;

  @Column()
  total_invested: number;

  @Column()
  profit: number;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Balances;
