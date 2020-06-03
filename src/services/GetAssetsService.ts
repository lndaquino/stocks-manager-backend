import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Assets from '../models/Assets';

class GetAssetsService {
  public async run(): Promise<Assets[]> {
    const assetsRepository = getRepository(Assets);

    const assets = await assetsRepository.find();

    if (!assets.length) throw new AppError('Error loading assets database');

    return assets;
  }
}

export default GetAssetsService;
