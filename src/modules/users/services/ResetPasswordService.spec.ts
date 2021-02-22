import AppError from '@shared/erros/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let resetPassword: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        resetPassword = new ResetPasswordService(
            fakeUserRepository,
            fakeUserTokenRepository
        );

    });

    it('should be able to reset the password', async () => {

        const user = await fakeUserRepository.create({
            name: 'Marcos Souza',
            email: 'marcos@gmail.com',
            password: '1234567'
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);
        const newPassword = '123123123'

        await resetPassword.execute({
            token,
            password: newPassword,
        });

        const updateUser = await fakeUserRepository.findById(user.id);

        expect(updateUser?.password).toBe(newPassword);
    });
});
