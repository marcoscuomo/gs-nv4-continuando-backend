import { injectable, inject } from 'tsyringe';

import AppError from '@shared/erros/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequestDTO {
    email: string;
}

@injectable()
class SendForgotPasswordServiceEmailService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('IUserTokenRepository')
        private userTokenRepository: IUserTokenRepository
        ){}

    public async execute({ email }: IRequestDTO): Promise<void> {

        const user = await this.usersRepository.findyByEmail(email);

        if(!user){
            throw new AppError('User does not exists');
        }

        await this.userTokenRepository.generate(user.id);

        this.mailProvider.sendMail(email, 'Pedido de recuperação de senha recebido');
    }
}

export default SendForgotPasswordServiceEmailService;
