import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Balance from '../models/Balaces';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  user_id: string;
  transaction_id: string;
}

class DeleteTransactionService {
  public async run({ user_id, transaction_id }: Request): Promise<void> {
    const balanceRepository = getRepository(Balance);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // find transaction
    const transaction = await transactionsRepository.find({
      user_id,
      id: transaction_id,
    });

    // check if transactions exists
    if (!transaction.length) {
      throw new AppError('Invalid transaction or user id');
    }

    // check if transaction is related to a active trade
    if (transaction[0].closed_id) {
      // transactions related to closed trades can´t be deleted
      throw new AppError(
        'Transactions related to closed tradings can´t be deleted.',
      );
    }

    // validate and update balance with this deleting
    const updatedBalance = await transactionsRepository.updateBalanceDeletingTransaction(
      transaction[0],
    );

    const { asset_id } = transaction[0];

    if (updatedBalance.total_quantity === 0) {
      // delete balace
      await balanceRepository.delete({ user_id, asset_id });
    } else {
      // update balance
      await balanceRepository.update({ user_id, asset_id }, updatedBalance);
    }

    await transactionsRepository.delete({
      user_id,
      id: transaction_id,
    });
  }
}

export default DeleteTransactionService;
