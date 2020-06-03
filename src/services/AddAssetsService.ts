import { getRepository } from 'typeorm';

import Assets from '../models/Assets';

interface Request {
  asset: string;
}
class AddAssetsService {
  public async run(assets: Request[]): Promise<Assets[]> {
    const assetsRepository = getRepository(Assets);

    /* const addedAssets: Assets[] = [];

    assets.forEach(async asset => {
      const assetExists = await assetsRepository.find({ ticker: asset });

      if (!assetExists.length) {
        const newAsset = assetsRepository.create({
          ticker: asset,
          cotation: 0,
        });

        await assetsRepository.save(newAsset);
        addedAssets.push(newAsset);
      } else {
        addedAssets.push(assetExists[0]);
      }
    });

    return addedAssets; */

    const addedAssets = await Promise.all(
      assets.map(async asset => {
        const assetExists = await assetsRepository.find({
          ticker: asset.asset,
        });
        if (!assetExists.length) {
          const newAsset = assetsRepository.create({
            ticker: asset.asset,
            cotation: 0,
          });

          await assetsRepository.save(newAsset);
          return newAsset;
        }
        return assetExists[0];
      }),
    );

    return addedAssets;
  }
}

export default AddAssetsService;
