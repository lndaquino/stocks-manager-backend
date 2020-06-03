import { EntityRepository, Repository, IsNull } from 'typeorm';

import Assets from '../models/Assets';

import GetAssetsDataService from '../services/GetAssetsDataService';

@EntityRepository(Assets)
class AssetsRepository extends Repository<Assets> {
  public async getAssetsWithUpdatedCotation(
    assets: Assets[],
  ): Promise<Assets[]> {
    const getAssetsData = new GetAssetsDataService();

    const updatedAssets = await Promise.all(
      assets.map(async asset => {
        const cotation = await getAssetsData.run(asset.ticker);
        return { ...asset, cotation } as Assets;
      }),
    );

    return updatedAssets;
  }
}

export default AssetsRepository;
