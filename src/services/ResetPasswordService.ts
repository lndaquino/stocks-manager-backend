import { getCustomRepository, getRepository } from 'typeorm';
import { isAfter, addHours } from 'date-fns';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';

import User from '../models/Users';
import UserTokenRepository from '../repositories/UserTokenRepository';

interface Request {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async run({ token, password }: Request): Promise<void> {
    const userTokenRepository = getCustomRepository(UserTokenRepository);

    const userToken = await userTokenRepository.findOne({ token });

    if (!userToken) {
      throw new AppError('User token doesn´t exist.');
    }

    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne({ id: userToken.user_id });

    if (!user) {
      throw new AppError('User doesn´t exist.');
    }

    const tokenCreatedAt = userToken.created_at;

    const comparedDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), comparedDate)) {
      throw new AppError('Expired token.');
    }

    user.password = await hash(password, 8);

    usersRepository.save(user);

    userTokenRepository.delete({ user_id: user.id });
  }
}

export default ResetPasswordService;
