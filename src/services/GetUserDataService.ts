import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import User from '../models/Users';

interface Request {
  user_id: string;
}

class GetUserDataService {
  public async run({ user_id }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      id: user_id,
    });

    if (!user) throw new AppError('Error setting user id.');

    return user;
  }
}

export default GetUserDataService;
