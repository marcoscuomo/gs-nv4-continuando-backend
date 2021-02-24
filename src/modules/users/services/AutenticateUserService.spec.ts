import AppError from '@shared/erros/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProiver from '../providers/HashProviders/fakes/FakeHashProvider';
import AutenticateUserService from './AutenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProiver: FakeHashProiver;
let authenticateUser: AutenticateUserService;
let createUser: CreateUserService;

describe('AutenticateUser', () => {

    beforeEach(() => {

        fakeUserRepository = new FakeUserRepository();
        fakeHashProiver = new FakeHashProiver();

        createUser = new CreateUserService(fakeUserRepository, fakeHashProiver);
        authenticateUser = new AutenticateUserService(fakeUserRepository, fakeHashProiver);


    });

    it('should be able to authenticate', async () => {


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

        await expect(
            authenticateUser.execute({
                email: 'marcos@gmail.com',
                password: '12233443'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {

        await createUser.execute({
            name: 'Marcos Souza',
            email: 'marcos@gmail.com',
            password: '12233443'
        });

        await expect(
            authenticateUser.execute({
                email: 'marcos@gmail.com',
                password: 'wrong-password'
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
