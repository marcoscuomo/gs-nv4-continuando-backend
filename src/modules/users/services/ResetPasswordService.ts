import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/erros/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';

interface IRequestDTO {
    token: string,
    password: string;
}

@injectable()
class ResetPasswordService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
        ){}

    public async execute({ token, password }: IRequestDTO): Promise<void> {
        const userToken = await this.userTokenRepository.findByToken(token);

        if(!userToken){
            throw new AppError('userToken does not exists');
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if(!user){
            throw new AppError('user does not exists');
        }

        const tokenCreatedAt = userToken.created_at;
        const compareDate = addHours(tokenCreatedAt, 2);

        if(isAfter(Date.now(), compareDate)){
            throw new AppError('Token expired');
        }

        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);

    }
}

export default ResetPasswordService;
