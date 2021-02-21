import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/erros/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider';

interface IRequestDTO {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
        ){}

    public async execute({name, email, password}: IRequestDTO): Promise<User> {

        // const usersRepository = getRepository(User);

        // Verifica se o email do usuário já está cadastrado
        const checkUserExists = await this.usersRepository.findyByEmail(email);

        if(checkUserExists){
            throw new AppError('Email adress already used');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword
        });

        // await this.usersRepository.save(user);

        return user;

    }
}

export default CreateUserService;
