import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/erros/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';

interface IRequestDTO {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AutenticateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
        ){}

    public async execute({email, password}: IRequestDTO): Promise<IResponse>{
        // const usersRepository = getRepository(User);

        const user = await this.usersRepository.findyByEmail(email)

        if(!user){
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const passwordMatched = await this.hashProvider.compareHash(password, user.password);

        if(!passwordMatched){
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn
        });

        return {user, token};
    }
}

export default AutenticateUserService;
