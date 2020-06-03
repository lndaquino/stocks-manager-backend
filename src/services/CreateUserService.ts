import { getRepository } from 'typeorm'; // como não vamos criar nenhuma função personalizada para tratar o banco vamos usar as nativas, não precisando criar um repository para user. Appointments criou pq precisavamos de uma função personalizada de busca por data
import { hash } from 'bcryptjs'; // biblioteca de criptografia, tem tb q importar a declaração de tipos como dependência de desenvolvimento

import AppError from '../errors/AppError';

import User from '../models/Users';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async run({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already in use.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
