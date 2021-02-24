import AppError from '@shared/erros/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        showProfile = new ShowProfileService(fakeUserRepository);
    });

    it('Should be able  show the profile', async () => {

        const user = await fakeUserRepository.create({
            name: 'Marcos',
            email: 'marco@uol.com',
            password: '1243'
        });


        const profile = await showProfile.execute({
            user_id: user.id
        });

        expect(profile.name).toBe('Marcos');
        expect(profile.email).toBe('marco@uol.com');
    });

    it('Should not be able  show the profile fron non-existing user', async () => {

        expect(
            showProfile.execute({
                user_id: 'non-existing-user-id'
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
