import AppError from '@shared/erros/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeEmailProvider';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUserRepository,
            fakeMailProvider,
            fakeUserTokenRepository
        );

    });

    it('should be able to recover the password using the email', async () => {

        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUserRepository.create({
            name: 'Marcos',
            email: 'marcos@gmail.com',
            password: '12345'
        });

        await sendForgotPasswordEmail.execute({
            email: 'marcos@gmail.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {

        await expect(
            sendForgotPasswordEmail.execute({
                email: 'marcos@gmail.com',
            })
        ).rejects.toBeInstanceOf(AppError);

    });

    it('should generate a forgot password token', async () => {

        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

        const user = await fakeUserRepository.create({
            name: 'Marcos',
            email: 'marcos@gmail.com',
            password: '12345'
        });

        await sendForgotPasswordEmail.execute({
            email: 'marcos@gmail.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);

    });
});
