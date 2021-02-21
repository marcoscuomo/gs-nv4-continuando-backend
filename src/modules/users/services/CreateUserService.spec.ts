import AppError from '@shared/erros/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProiver from '../providers/HashProviders/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProiver = new FakeHashProiver();
        const createUser = new CreateUserService(fakeUserRepository, fakeHashProiver);

        const user = await createUser.execute({
            name: 'Marcos Souza',
            email: 'marcos@gmail.com',
            password: '12233443'
        });

        expect(user).toHaveProperty('id');
    });

    it('should nor be able to create a new user with same email from another', async () => {
        const fakeUserRepository = new FakeUserRepository();
        const fakeHashProiver = new FakeHashProiver();
        const createUser = new CreateUserService(fakeUserRepository, fakeHashProiver);

        await createUser.execute({
            name: 'Marcos Souza',
            email: 'marcos@gmail.com',
            password: '12233443'
        });

        expect(
            createUser.execute({
                name: 'Marcos Souza',
                email: 'marcos@gmail.com',
                password: '12233443'
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
