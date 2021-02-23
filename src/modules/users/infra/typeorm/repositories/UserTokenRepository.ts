import { getRepository, Repository } from 'typeorm';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class UserTokensRepository implements IUserTokenRepository {

    private ormRepository: Repository<UserToken>;

    constructor() {
        this.ormRepository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.ormRepository.findOne({
            where: { token },
        });

        return userToken;
    }

    async generate(user_id: string): Promise<UserToken> {
        const userToken = this.ormRepository.create({
            user_id
        });

        await this.ormRepository.save(userToken);

        return userToken;
    }

    public async findById(id: string): Promise<UserToken | undefined> {
        const user = await this.ormRepository.findOne(id);

        return user;
    }



}

export default UserTokensRepository;
