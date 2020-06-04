import { EntityRepository, Repository, IsNull } from 'typeorm';

import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface ConfigRequest {
  quantity: number;
  type: 'buy' | 'sell';
  date: Date;
  operation: 'add' | 'delete';
}

interface Balance {
  total_quantity: number;
  total_value: number;
  total_invested: number;
  profit: number;
}

interface AddingTransactionRequest {
  user_id: string;
  asset_id: string;
  quantity: number;
  value: number;
  cost: number;
  type: 'buy' | 'sell';
  date: Date;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private validateBalance(
    transactions: Transaction[],
    config: ConfigRequest,
  ): Balance {
    // ascendent sorting
    transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const balance: Balance = {
      total_quantity: 0,
      total_value: 0,
      total_invested: 0,
      profit: 0,
    };

    transactions.forEach(element => {
      if (element.type === 'buy') {
        balance.total_quantity += element.quantity;
        balance.total_value += element.total_value;
        balance.total_invested += element.total_value;
      } else {
        balance.profit +=
          (element.value - balance.total_value / balance.total_quantity) *
            element.quantity -
          element.cost;

        balance.total_invested += element.cost;

        balance.total_value =
          element.cost +
          (balance.total_value / balance.total_quantity) *
            (balance.total_quantity - element.quantity);

        if (balance.total_quantity - element.quantity < 0) {
          throw new AppError(
            `No valid balance to ${config.operation} ${config.type} transaction of ${config.quantity} in ${config.date}`,
            401,
          );
        } else {
          balance.total_quantity -= element.quantity;
        }
      }
    });

    return balance;
  }

  public async updateBalanceAddingTransaction({
    user_id,
    asset_id,
    quantity,
    value,
    cost,
    type,
    date,
  }: AddingTransactionRequest): Promise<Balance> {
    const transactions = await this.find({
      user_id,
      asset_id,
      closed_id: IsNull(),
    });

    const newTransaction: Transaction = {
      ...transactions[0],
      user_id,
      asset_id,
      quantity,
      value,
      total_value: quantity * value,
      cost,
      type,
      date,
    };

    transactions.push(newTransaction);

    const balance = this.validateBalance(transactions, {
      quantity,
      type,
      date,
      operation: 'add',
    });

    return balance;
  }

  public async updateBalanceDeletingTransaction(
    transaction: Transaction,
  ): Promise<Balance> {
    const { id, user_id, asset_id, quantity, type, date } = transaction;

    const transactions = await this.find({
      user_id,
      asset_id,
      closed_id: IsNull(),
    });

    const transactionIndex = transactions.findIndex(item => item.id === id);

    // remove the desired transaction from the array
    transactions.splice(transactionIndex, 1);

    const balance = this.validateBalance(transactions, {
      quantity,
      type,
      date,
      operation: 'delete',
    });

    return balance;
  }
}

export default TransactionsRepository;
