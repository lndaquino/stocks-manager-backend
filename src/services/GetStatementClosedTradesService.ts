import { getRepository } from 'typeorm';
import { getYear, getMonth, getDate } from 'date-fns';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import ClosedTrades from '../models/ClosedTrades';

interface Request {
  user_id: string;
  closed_id: string;
}

class GetStatementClosedTrades {
  public async run({ user_id, closed_id }: Request): Promise<Transaction[]> {
    const transactionsRepository = getRepository(Transaction);
    const closedTradesRepository = getRepository(ClosedTrades);

    const statement = await transactionsRepository.find({
      user_id,
      closed_id,
    });

    if (!statement.length)
      throw new AppError('Error setting asset or user id.');

    const parsedStatement = statement.map(item => {
      const { date } = item;
      const year = getYear(date);
      const month = getMonth(date);
      const day = getDate(date);
      const parsedDate = `${String(day).padStart(2, '0')}-${String(
        month + 1,
      ).padStart(2, '0')}-${year}`;

      const parsedItem = { ...item, date: parsedDate };
      return parsedItem;
    });

    const closedTrade = await closedTradesRepository.findOne({ id: closed_id });

    if (!closedTrade)
      throw new AppError('Error setting user id or asset in balance');

    const asset = {
      ticker: closedTrade.asset.ticker,
      wallet: closedTrade.total_invested,
      profit: closedTrade.profit,
    };

    const response = { statement: parsedStatement, asset };
    return response;
  }
}

export default GetStatementClosedTrades;
