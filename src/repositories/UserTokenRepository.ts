import { EntityRepository, Repository, IsNull } from 'typeorm';

import UserToken from '../models/UserToken';
import AppError from '../errors/AppError';

@EntityRepository(UserToken)
class UserTokenRepository extends Repository<UserToken> {
  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.create({ user_id });

    await this.save(userToken);

    return userToken;
  }
}

export default UserTokenRepository;
