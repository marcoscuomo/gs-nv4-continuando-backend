import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllInMounthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMounthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentRepository implements IAppointmentRepository {

    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined>{

        const findAppointment = this.appointments.find(
            appointment => isEqual(appointment.date, date)
        );

        return findAppointment;

    }

    public async create({ provider_id, date, user_id }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, {id: uuid(), date, provider_id, user_id});

        /** Mesmo que o código acima */
        // appointment.id = uuid();
        // appointment.date = date;
        // appointment.provider_id = provider_id;

        this.appointments.push(appointment);

        return appointment;
    }

    public async findAllInMounthFromProvider({provider_id, month, year}: IFindAllInMounthFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment =>
            appointment.provider_id === provider_id &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year
        );

        return appointments;
    }

    public async findAllInDayFromProvider({provider_id, day, month, year}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {

        const appointments = this.appointments.filter(appointment =>
            appointment.provider_id === provider_id &&
            getDate(appointment.date) === day &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year
        );

        return appointments;

    }

}

export default AppointmentRepository;
