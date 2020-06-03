import yahooFinance from 'yahoo-finance';
import { getRepository } from 'typeorm';

import Assets from '../models/Assets';
import AppError from '../errors/AppError';

class GetAssetsDataService {
  public async run(ticker: string): Promise<number> {
    const assetsRepository = getRepository(Assets);

    const asset = await assetsRepository.findOne({ ticker });
    console.log(asset);

    if (!asset) throw new AppError('Invalid asset.');

    const assetUpdatedDay = asset.updated_at.getDate();
    const assetUpdatedHour = asset.updated_at.getHours();
    const assetUpdatedMonth = asset.updated_at.getMonth();
    const assetUpdatedYear = asset.updated_at.getFullYear();

    const now = new Date();
    const day = now.getDate();
    const hour = now.getHours();
    const month = now.getMonth();
    const year = now.getFullYear();
    console.log(
      assetUpdatedHour,
      assetUpdatedDay,
      assetUpdatedMonth,
      assetUpdatedYear,
    );
    console.log(hour, day, month, year);

    // ticker last atualization between yesterday 6pm and now
    if (
      ((assetUpdatedHour >= 18 && assetUpdatedDay === day - 1) ||
        assetUpdatedDay === day) &&
      assetUpdatedMonth === month &&
      assetUpdatedYear === year
    ) {
      console.log('Sem yahoo...');
      return asset.cotation;
    }

    console.log('Chamando yahooFinance...');
    const assetYahooPriceData = await yahooFinance.quote(`${ticker}.SA`, [
      'price',
    ]);
    // if it´s before 10am return regularMarketPrice else return regularMarketPreviousClose
    if (hour <= 10) {
      asset.cotation = assetYahooPriceData.price.regularMarketPrice;
    } else {
      asset.cotation = assetYahooPriceData.price.regularMarketPreviousClose;
    }

    await assetsRepository.update(
      { id: asset.id },
      { cotation: Number(asset.cotation) },
    );
    return asset.cotation;
  }
}

export default GetAssetsDataService;
