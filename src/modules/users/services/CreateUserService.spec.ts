import AppError from '@shared/erros/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProiver from '../providers/HashProviders/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProiver: FakeHashProiver;
let createUser: CreateUserService;

describe('CreateUser', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProiver = new FakeHashProiver();
        createUser = new CreateUserService(fakeUserRepository, fakeHashProiver);
    });

    it('should be able to create a new user', async () => {


        const user = await createUser.execute({
            name: 'Marcos Souza',
            email: 'marcos@gmail.com',
            password: '12233443'
        });

        expect(user).toHaveProperty('id');
    });

    it('should nor be able to create a new user with same email from another', async () => {

        await createUser.execute({
            name: 'Marcos Souza',
            email: 'marcos@gmail.com',
            password: '12233443'
        });

        await expect(
            createUser.execute({
                name: 'Marcos Souza',
                email: 'marcos@gmail.com',
                password: '12233443'
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
