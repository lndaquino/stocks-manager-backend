import { getRepository } from 'typeorm';
import { getYear, getMonth, getDate } from 'date-fns';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  user_id: string;
}

class GetUserStatementService {
  public async run({ user_id }: Request): Promise<Transaction[]> {
    const transactionsRepository = getRepository(Transaction);

    const statement = await transactionsRepository.find({
      user_id,
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

    return parsedStatement;
  }
}

export default GetUserStatementService;
