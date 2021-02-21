import AppError from '@shared/erros/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProiver from '../providers/HashProviders/fakes/FakeHashProvider';
import AutenticateUserService from './AutenticateUserService';
import CreateUserService from './CreateUserService';

describe('AutenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProiver = new FakeHashProiver();

        const authenticateUser = new AutenticateUserService(fakeUserRepository, fakeHashProiver);
        const createUser = new CreateUserService(fakeUserRepository, fakeHashProiver);

        await createUser.execute({
            name: 'Marcos Souza',
            email: 'marcos@gmail.com',
            password: '12233443'
        });

        const user = await authenticateUser.execute({
            email: 'marcos@gmail.com',
            password: '12233443'
        });

        expect(user).toHaveProperty('token');
    });

    it('should not be able to authenticate with non existing user', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProiver = new FakeHashProiver();

        const authenticateUser = new AutenticateUserService(fakeUserRepository, fakeHashProiver);

        expect(
            authenticateUser.execute({
                email: 'marcos@gmail.com',
                password: '12233443'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProiver = new FakeHashProiver();

        const authenticateUser = new AutenticateUserService(fakeUserRepository, fakeHashProiver);
        const createUser = new CreateUserService(fakeUserRepository, fakeHashProiver);

        await createUser.execute({
            name: 'Marcos Souza',
            email: 'marcos@gmail.com',
            password: '12233443'
        });

        expect(
            authenticateUser.execute({
                email: 'marcos@gmail.com',
                password: 'wrong-password'
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
