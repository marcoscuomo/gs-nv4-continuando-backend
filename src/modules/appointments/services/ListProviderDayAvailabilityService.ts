import { injectable, inject } from 'tsyringe';
import { getHours } from 'date-fns';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IAppointmentRepository from '../repositories/IAppointmentsRepository'

interface IRequestDTO {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailanilityService {

    constructor(
        @inject('AppointmentRepository')
        private appointmentRepository: IAppointmentRepository
        ){}

    public async execute({ provider_id, month, year, day }: IRequestDTO): Promise<IResponse>{


        const appointments = await this.appointmentRepository.findAllInDayFromProvider({
            provider_id,
            year,
            month,
            day
        });

        const hourStart = 8;

        const eachHourArray = Array.from(
            {length: 10},
            (_, index) => index + hourStart,
        );

        const availability = eachHourArray.map(hour => {

            const hasAppointmentInHour = appointments.find(appointment =>
                getHours(appointment.date) === hour,
            )

            return {
                hour,
                available: !hasAppointmentInHour
            }
        })

        return availability;
    }
}

export default ListProviderDayAvailanilityService;
