import { getRepository, Repository } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import Users from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

class UsersRepository implements IUserRepository {

    private ormRepository: Repository<Users>;

    constructor() {
        this.ormRepository = getRepository(Users);
    }
    public async findById(id: string): Promise<Users | undefined> {
        const user = await this.ormRepository.findOne(id);

        return user;
    }
    public async findyByEmail(email: string): Promise<Users | undefined> {

        const user = await this.ormRepository.findOne({
            where: { email },
        });

        return user;
    }


    public async create(userData: ICreateUserDTO): Promise<Users> {
        const user = this.ormRepository.create(userData);

        await this.ormRepository.save(user);

        return user;
    }

    public async save(user: Users): Promise<Users> {
        return this.ormRepository.save(user);
    }


}

export default UsersRepository;
