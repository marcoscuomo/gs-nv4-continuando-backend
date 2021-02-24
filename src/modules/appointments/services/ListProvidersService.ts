import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

interface IRequestDTO {
    user_id: string
}

@injectable()
class ListProiversService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        ){}

    public async execute({ user_id }: IRequestDTO): Promise<User[]>{

        const users = await this.usersRepository.findAllProviders({
            except_user_id: user_id
        });

        return users;
    }
}

export default ListProiversService;
