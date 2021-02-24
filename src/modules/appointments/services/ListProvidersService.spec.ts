import AppError from '@shared/erros/AppError';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        listProviders = new ListProvidersService(fakeUserRepository);
    });

    it('Should be able to list the providers', async () => {

        const user1 = await fakeUserRepository.create({
            name: 'Marcos',
            email: 'marco@uol.com',
            password: '1243'
        });

        const user2 = await fakeUserRepository.create({
            name: 'Carlos',
            email: 'carlos@uol.com',
            password: '1243'
        });

        const loggedUser = await fakeUserRepository.create({
            name: 'Maria',
            email: 'maria@uol.com',
            password: '1243'
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id
        });

        expect(providers).toEqual([user1, user2]);
    });
});
