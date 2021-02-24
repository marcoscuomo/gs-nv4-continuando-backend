import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/erros/AppError';
import User from '../infra/typeorm/entities/User';
// import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';
import AppError from '@shared/erros/AppError';


interface IRequestDTO {
    user_id: string,
    name: string,
    email: string,
    old_password?: string,
    password?: string
}

@injectable()
class UpdateProfile {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
        ){}

    public async execute({user_id, name, email, password, old_password}: IRequestDTO): Promise<User>{

        const user = await this.usersRepository.findById(user_id);

        if(!user){
            throw new AppError('User not found');
        }

        const userWithUpdateEmail = await this.usersRepository.findyByEmail(email);

        if(userWithUpdateEmail && userWithUpdateEmail.id !== user_id){
            throw new AppError('E-mail already in use');
        }

        if(password && !old_password){
            throw new AppError('You need to inform the old password to set a new password');
        }

        if(password && old_password){
            const checkPassword = await this.hashProvider.compareHash(
                old_password,
                user.password
            );

            if(!checkPassword){
                throw new AppError('Old password does not match');
            }
        }

        user.name = name;
        user.email = email;

        if(password){
            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateProfile;
