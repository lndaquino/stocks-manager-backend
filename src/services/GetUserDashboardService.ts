import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Balance from '../models/Balaces';
import AssetsRepository from '../repositories/AssetsRepository';

interface Request {
  user_id: string;
}

interface Wallet {
  wallet: number;
  profit: number;
}

interface Response {
  balance: Balance[];
  wallet: Wallet;
}

class GetUserDashboard {
  public async run({ user_id }: Request): Promise<Response> {
    const balanceRepository = getRepository(Balance);
    const assetsRepository = getCustomRepository(AssetsRepository);

    const balance = await balanceRepository.find({ user_id });

    if (!balance.length)
      throw new AppError('User don´t have any active trade yet');

    const assets = balance.map(item => item.asset);
    const assetsWithUpdatedCotation = await assetsRepository.getAssetsWithUpdatedCotation(
      assets,
    );

    const updatedBalance = balance.map((element, index) => {
      return {
        ...element,
        asset: assetsWithUpdatedCotation[index],
        profit:
          (assetsWithUpdatedCotation[index].cotation -
            element.total_value / element.total_quantity) *
          element.total_quantity,
      };
    });

    const wallet = updatedBalance
      .map(item => item.total_quantity * item.asset.cotation)
      .reduce((total, next) => total + next);
    const profit = updatedBalance
      .map(item => item.profit)
      .reduce((total, next) => total + next);

    const walletResponse = { wallet, profit };

    const response = { balance: updatedBalance, wallet: walletResponse };

    return response;
  }
}

export default GetUserDashboard;
