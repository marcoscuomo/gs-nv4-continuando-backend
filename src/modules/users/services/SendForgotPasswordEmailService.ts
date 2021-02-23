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

        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository
        ){}

    public async execute({ email }: IRequestDTO): Promise<void> {

        const user = await this.usersRepository.findyByEmail(email);

        if(!user){
            throw new AppError('User does not exists');
        }

        const { token } = await this.userTokenRepository.generate(user.id);

        await this.mailProvider.sendMail(email, `Pedido de recuperação de senha recebido ${token}`);
    }
}

export default SendForgotPasswordServiceEmailService;
