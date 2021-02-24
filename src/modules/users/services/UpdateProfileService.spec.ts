import AppError from '@shared/erros/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProviders/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateProfile: UpdateProfileService;
let fakeHashProvider: FakeHashProvider;

describe('UpdateProfile', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeStorageProvider = new FakeStorageProvider();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileService(fakeUserRepository, fakeHashProvider);
    });

    it('Should be able update the profile', async () => {

        const user = await fakeUserRepository.create({
            name: 'Marcos',
            email: 'marco@uol.com',
            password: '1243'
        });


        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Marcos Souza',
            email: 'marcos@gmail.com'
        });

        expect(updatedUser.name).toBe('Marcos Souza');
        expect(updatedUser.email).toBe('marcos@gmail.com');
    });

    it('Should not be able to change to another user email', async () => {

        await fakeUserRepository.create({
            name: 'Marcos',
            email: 'marco@uol.com',
            password: '1243'
        });

        const user = await fakeUserRepository.create({
            name: 'Carlos',
            email: 'carlos@uol.com',
            password: '1243'
        });


        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Carlos',
                email: 'marco@uol.com',
                password: '1243'
            })
        ).rejects.toBeInstanceOf(AppError);


    });

    it('Should be able to update the password', async () => {

        const user = await fakeUserRepository.create({
            name: 'Marcos',
            email: 'marco@uol.com',
            password: '1243'
        });


        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Marcos Souza',
            email: 'marcos@gmail.com',
            old_password: '1243',
            password: '123123'
        });

        expect(updatedUser.password).toBe('123123');

    });

    it('Should not be able to update the password without old password', async () => {

        const user = await fakeUserRepository.create({
            name: 'Marcos',
            email: 'marco@uol.com',
            password: '1243'
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Marcos Souza',
                email: 'marcos@gmail.com',
                password: '123123'
            })
        ).rejects.toBeInstanceOf(AppError);

    });

    it('Should not be able to update the password with wrong old password', async () => {

        const user = await fakeUserRepository.create({
            name: 'Marcos',
            email: 'marco@uol.com',
            password: '1243'
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Marcos Souza',
                email: 'marcos@gmail.com',
                old_password: 'wrong-old-password',
                password: '123123'
            })
        ).rejects.toBeInstanceOf(AppError);

    });
});
