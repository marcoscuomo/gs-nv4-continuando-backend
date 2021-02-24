import { getRepository, Repository, Not } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import Users from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

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

    public async findAllProviders({except_user_id}: IFindAllProvidersDTO): Promise<Users[]> {

        let users: Users[];

        if(except_user_id){
            users = await this.ormRepository.find({
                where: {
                    id: Not(except_user_id)
                }
            });
        } else {
            users = await this.ormRepository.find();
        }

        return users;
    }

}

export default UsersRepository;
