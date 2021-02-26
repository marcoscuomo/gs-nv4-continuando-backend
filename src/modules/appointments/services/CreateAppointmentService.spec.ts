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

        const appointment = await createAppointment.execute({
            date: new Date(),
            user_id: '123',
            provider_id: '2332'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('2332');
    });

    it('should not be able to create two appointments on the same time', async () => {

        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointment.execute({
            date: appointmentDate,
            user_id: '123',
            provider_id: '2332'
        });

        expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: '123',
                provider_id: '2332'
            })
        ).rejects.toBeInstanceOf(AppError);

    });
});
