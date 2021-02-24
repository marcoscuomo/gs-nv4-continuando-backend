import { injectable, inject } from 'tsyringe';


import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';
import AppError from '@shared/erros/AppError';


interface IRequestDTO {
    user_id: string
}

@injectable()
class ShowProfileService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        ){}

    public async execute({ user_id }: IRequestDTO): Promise<User>{

        const user = await this.usersRepository.findById(user_id);

        if(!user){
            throw new AppError('User not found');
        }

        return user;
    }
}

export default ShowProfileService;
