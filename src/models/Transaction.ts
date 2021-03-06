import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Users from './Users';
import Assets from './Assets';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column()
  asset_id: string;

  @ManyToOne(() => Assets, asset => asset.transaction, { eager: true })
  @JoinColumn({ name: 'asset_id' })
  asset: Assets;

  @Column()
  type: 'buy' | 'sell';

  @Column('timestamp with time zone')
  date: Date;

  @Column()
  quantity: number;

  @Column()
  value: number;

  @Column()
  cost: number;

  @Column()
  total_value: number;

  @Column()
  closed_id: string;

  @CreateDateColumn()
  created_at: Date;
}

export default Transaction;
