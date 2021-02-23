import { injectable, inject } from 'tsyringe';
import path from 'path';

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

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs',
        );

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email
            },
            subject: '[GoBarber] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `http://localhost/3000/reset_password?token=${token}`
                },
            },

        });
    }
}

export default SendForgotPasswordServiceEmailService;
