import AppError from '@shared/erros/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProviders/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordPasswordService', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        fakeHashProvider = new FakeHashProvider();
        resetPassword = new ResetPasswordService(
            fakeUserRepository,
            fakeUserTokenRepository,
            fakeHashProvider
        );

    });

    it('should be able to reset the password', async () => {

        const user = await fakeUserRepository.create({
            name: 'Marcos Souza',
            email: 'marcos@gmail.com',
            password: '1234567'
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const newPassword = '123123123'

        await resetPassword.execute({
            token,
            password: newPassword,
        });

        const updateUser = await fakeUserRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith(newPassword);
        expect(updateUser?.password).toBe(newPassword);
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {

        const { token } = await fakeUserTokenRepository.generate('non-existing-user');

        await expect(
            resetPassword.execute({
                token,
                password: '123'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to reset the password if passed more than 2 hours', async () => {

        const user = await fakeUserRepository.create({
            name: 'Marcos Souza',
            email: 'marcos@gmail.com',
            password: '1234567'
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPassword.execute({
                token,
                password: '123456',
            })
        ).rejects.toBeInstanceOf(AppError);
    });


});
