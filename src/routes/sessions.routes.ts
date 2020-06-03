import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';
import GetAssetsService from '../services/GetAssetsService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.run({ email, password });

  delete user.password;

  const getAssets = new GetAssetsService();

  const assets = await getAssets.run();

  return response.json({ user, token, assets });
});

export default sessionsRouter;
