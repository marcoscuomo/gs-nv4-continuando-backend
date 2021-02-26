import AppError from '@shared/erros/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {

    let fakeAppointmentRepository: FakeAppointmentRepository;
    let createAppointment: CreateAppointmentService;

    beforeEach(() => {

        fakeAppointmentRepository = new FakeAppointmentRepository();
        createAppointment = new CreateAppointmentService(fakeAppointmentRepository);

    });

    it('should be able to create a new appointment', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });


        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: '123',
            provider_id: '2332'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('2332');
    });

    it('should not be able to create two appointments on the same time', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 10).getTime();
        });

        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointment.execute({
            date: appointmentDate,
            user_id: '123',
            provider_id: '2332'
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: '123',
                provider_id: '2332'
            })
        ).rejects.toBeInstanceOf(AppError);

    });

    it('shoud not be able to create an appointment on a past date', async() => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                user_id: '123',
                provider_id: '2332'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud not be able to create an appointment with same user as provider', async() => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                user_id: '123',
                provider_id: '123'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud not be able to create an appointment before 8am an after 5pm', async() => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 7),
                user_id: '123123',
                provider_id: '123'
            })
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 18),
                user_id: '123123',
                provider_id: '123'
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
