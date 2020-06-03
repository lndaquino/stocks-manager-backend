import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import CreateUserService from '../services/CreateUserService';
import GetUserDataService from '../services/GetUserDataService';
import UpdateUserDataService from '../services/UpdateUserDataService';

const usersRouter = Router();

usersRouter.post('/new', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.run({ name, email, password });

  delete user.password;

  return response.json(user);
});

usersRouter.get('/info', ensureAuthenticated, async (request, response) => {
  const user_id = request.user.id;

  const getUserData = new GetUserDataService();

  const userData = await getUserData.run({ user_id });

  delete userData.password;

  return response.json(userData);
});

usersRouter.put('/update', ensureAuthenticated, async (request, response) => {
  const user_id = request.user.id;
  const { name, email, password, new_password } = request.body;

  const updateUserData = new UpdateUserDataService();

  const updatedUser = await updateUserData.run({
    user_id,
    name,
    email,
    password,
    new_password,
  });

  delete updatedUser.password;

  return response.json(updatedUser);
});

export default usersRouter;
