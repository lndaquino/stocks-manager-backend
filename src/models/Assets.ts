import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import Balances from './Balaces';
import ClosedTrades from './ClosedTrades';
import Transaction from './Transaction';

@Entity('assets')
class Assets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ticker: string;

  @OneToMany(() => Balances, balance => balance.asset)
  balance: Balances;

  @OneToMany(() => ClosedTrades, closedtrade => closedtrade.asset)
  closedtrade: ClosedTrades;

  @OneToMany(() => Transaction, transaction => transaction.asset)
  transaction: Transaction;

  @Column()
  cotation: number;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Assets;
