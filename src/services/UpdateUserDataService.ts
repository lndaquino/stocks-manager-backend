import { getRepository, Not } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import AppError from '../errors/AppError';

import User from '../models/Users';

interface Request {
  user_id: string;
  name: string;
  email: string;
  password: string;
  new_password: string;
}

class UpdateUserDataService {
  public async run({
    user_id,
    name,
    email,
    new_password,
    password,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: {
        id: user_id,
      },
    });

    if (!user) throw new AppError('Invalid requisition.', 500);

    const checkIfEmailExists = await usersRepository.findOne({
      where: { email, id: Not(user_id) },
    });

    if (checkIfEmailExists) throw new AppError('Email already in use');

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Invalid password.', 401);
    }

    user.name = name;
    user.email = email;
    user.password = new_password ? await hash(new_password, 8) : user.password;

    return usersRepository.save(user);
  }
}

export default UpdateUserDataService;
