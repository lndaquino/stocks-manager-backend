import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import GetAssetsService from '../services/GetAssetsService';
import AddAssetsService from '../services/AddAssetsService';

const assetsRouter = Router();

assetsRouter.use(ensureAuthenticated);

assetsRouter.get('/', async (request, response) => {
  const getAssets = new GetAssetsService();

  const assets = await getAssets.run();

  return response.json(assets);
});

assetsRouter.post('/new', async (request, response) => {
  const addAssets = new AddAssetsService();
  const { assets } = request.body;

  const addedAssets = await addAssets.run(assets);

  return response.json(addedAssets);
});

export default assetsRouter;
