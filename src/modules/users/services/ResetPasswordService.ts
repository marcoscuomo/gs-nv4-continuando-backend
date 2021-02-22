import { injectable, inject } from 'tsyringe';

import AppError from '@shared/erros/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

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
        private userTokenRepository: IUserTokenRepository
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

        user.password = password;

        await this.usersRepository.save(user);

    }
}

export default ResetPasswordService;
