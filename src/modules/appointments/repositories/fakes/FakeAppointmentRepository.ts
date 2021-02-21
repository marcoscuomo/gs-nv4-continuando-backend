import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentRepository implements IAppointmentRepository {

    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined>{

        const findAppointment = this.appointments.find(
            appointment => isEqual(appointment.date, date)
        );

        return findAppointment;

    }

    public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, {id: uuid(), date, provider_id});

        /** Mesmo que o código acima */
        // appointment.id = uuid();
        // appointment.date = date;
        // appointment.provider_id = provider_id;

        this.appointments.push(appointment);

        return appointment;
    }


}

export default AppointmentRepository;
