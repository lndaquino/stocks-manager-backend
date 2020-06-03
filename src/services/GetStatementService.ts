import { getRepository, IsNull } from 'typeorm';
import { getYear, getMonth, getDate } from 'date-fns';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Balance from '../models/Balaces';

interface Request {
  user_id: string;
  asset_id: string;
}

class GetStatementService {
  public async run({ user_id, asset_id }: Request): Promise<Transaction[]> {
    const transactionsRepository = getRepository(Transaction);
    const balanceRepository = getRepository(Balance);

    const statement = await transactionsRepository.find({
      user_id,
      asset_id,
      closed_id: IsNull(),
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

    const balance = await balanceRepository.findOne({ user_id, asset_id });

    if (!balance)
      throw new AppError('Error setting user id or asset in balance');

    const asset = {
      ticker: balance.asset.ticker,
      wallet: balance.total_value,
      profit: balance.profit,
    };

    const parsedResponse = { statement: parsedStatement, asset };

    return parsedResponse;
  }
}

export default GetStatementService;
