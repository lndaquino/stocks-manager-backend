import { getRepository, getCustomRepository, IsNull } from 'typeorm'; // como não vamos criar nenhuma função personalizada para tratar o banco vamos usar as nativas, não precisando criar um repository para user. Appointments criou pq precisavamos de uma função personalizada de busca por data
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Balance from '../models/Balaces';
import ClosedTrades from '../models/ClosedTrades';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  user_id: string;
  asset_id: string;
  quantity: number;
  value: number;
  cost: number;
  type: 'buy' | 'sell';
  date: string;
}

class CreateTransactionService {
  public async run({
    user_id,
    asset_id,
    quantity,
    value,
    cost,
    type,
    date,
  }: Request): Promise<Transaction> {
    const total_value = quantity * value + cost;
    // if buy and don´t have balance create transaction and balance
    // if buy and have balance create transaction and redo weighted balance
    // if sell and have balance redo weigthed balance.
    // If don´t have valid balance during redo error. If balance quantity = 0 delete balance

    // verify user/asset balance - if don´t exist create the balance
    const balanceRepository = getRepository(Balance);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // convert date string to Date object
    const parts = date.split('-');
    const parsedDate = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
    );

    const balance = await balanceRepository.find({ user_id, asset_id });

    if (balance.length === 0) {
      // if sell and don´t have balance throw error
      if (type === 'sell') {
        throw new AppError(
          'User don´t have a valid balance to insert this amount of sell.',
          401,
        );
      }

      // if buy and don´t have balance create balance and transaction and return
      const newBalance = balanceRepository.create({
        user_id,
        asset_id,
        total_quantity: quantity,
        total_value,
        total_invested: total_value,
        profit: 0,
      });

      await balanceRepository.save(newBalance);

      const createdTransaction = transactionsRepository.create({
        user_id,
        asset_id,
        quantity,
        value,
        cost,
        total_value,
        type,
        date: parsedDate,
      });

      await transactionsRepository.save(createdTransaction);

      return createdTransaction;
    }

    // IF ALREADY HAVE A BALANCE
    // validate and update balance with this new transaction. Throw error if invalid balance
    const updatedBalance = await transactionsRepository.updateBalanceAddingTransaction(
      { user_id, asset_id, quantity, value, cost, type, date: parsedDate },
    );

    // save the transaction (has a valid balance)
    const createdTransaction = transactionsRepository.create({
      user_id,
      asset_id,
      quantity,
      value,
      cost,
      total_value,
      type,
      date: parsedDate,
    });

    await transactionsRepository.save(createdTransaction);

    // check if update balance quantity is zero
    if (updatedBalance.total_quantity === 0) {
      // save in closed transactions, mark transactions with closed_id and delete balance
      await balanceRepository.delete({ user_id, asset_id });

      const closedTradesRepository = getRepository(ClosedTrades);

      const closedTrade = closedTradesRepository.create({
        user_id,
        asset_id,
        total_invested: updatedBalance.total_invested,
        profit: updatedBalance.profit,
      });

      await closedTradesRepository.save(closedTrade);

      transactionsRepository.update(
        { user_id, asset_id, closed_id: IsNull() },
        { closed_id: closedTrade.id },
      );
    } else {
      // save updated balance
      await balanceRepository.update({ user_id, asset_id }, updatedBalance);
    }

    return createdTransaction;
  }
}

export default CreateTransactionService;
