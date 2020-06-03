import { getRepository, getCustomRepository } from 'typeorm';

import ClosedTrades from '../models/ClosedTrades';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  user_id: string;
  closed_id: string;
}

class DeleteTransactionService {
  public async run({ user_id, closed_id }: Request): Promise<void> {
    const closedTradesRepository = getRepository(ClosedTrades);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    await closedTradesRepository.delete({ id: closed_id });

    await transactionsRepository.delete({ closed_id });
  }
}

export default DeleteTransactionService;
