import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllInMounthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMounthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentRepository implements IAppointmentRepository {

    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined>{

        const findAppointment = await this.ormRepository.findOne({
            where: { date },
        });

        return findAppointment;
    }

    public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({ provider_id, date });

        await this.ormRepository.save(appointment);

        return appointment;
    }

    public async findAllInMounthFromProvider({provider_id, month, year}: IFindAllInMounthFromProviderDTO): Promise<Appointment[]> {

        // mes 1 ficará 01
        const parsedMouth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName =>
                    `to_chart(${dateFieldName}, 'MM-YYYY') = '${parsedMouth}-${year}'`
                ),
            }
        });

        return appointments;
    }

    public async findAllInDayFromProvider({provider_id, day, month, year}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {

        const parsedDay = String(day).padStart(2, '0');
        const parsedMouth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName =>
                    `to_chart(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMouth}-${year}'`
                ),
            }
        });

        return appointments;
    }
}

export default AppointmentRepository;
