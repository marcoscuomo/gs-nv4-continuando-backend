// import AppError from '@shared/erros/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository'
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {

    beforeEach(() => {

        fakeAppointmentRepository  = new FakeAppointmentRepository();
        listProviderDayAvailability = new ListProviderDayAvailabilityService(fakeAppointmentRepository);
    });

    it('Should be able to list the day availability from provider', async () => {

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 20, 14, 0, 0),
            user_id: 'user'
        });

        await fakeAppointmentRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 20, 15, 0, 0),
            user_id: 'user'
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 20, 11).getTime();
        });

        const availability = await listProviderDayAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 5,
            day: 20
        });

        expect(availability).toEqual(expect.arrayContaining([
            {hour: 8, available: false},
            {hour: 9, available: false},
            {hour: 10, available: false},
            {hour: 13, available: true},
            {hour: 14, available: false},
            {hour: 15, available: false},
            {hour: 16, available: true},
        ]))

    });
});
