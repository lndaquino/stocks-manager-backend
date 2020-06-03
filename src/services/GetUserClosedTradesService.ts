import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import ClosedTrades from '../models/ClosedTrades';

interface Request {
  user_id: string;
}

class GetUserClosedTrades {
  public async run({ user_id }: Request): Promise<ClosedTrades[]> {
    const closedTradesRepository = getRepository(ClosedTrades);

    const closedTrades = await closedTradesRepository.find({ user_id });

    if (!closedTrades.length)
      throw new AppError('User don´t have any closed trade yet', 401);

    return closedTrades;
  }
}

export default GetUserClosedTrades;
