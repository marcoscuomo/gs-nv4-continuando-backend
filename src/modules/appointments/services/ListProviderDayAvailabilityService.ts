import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

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
        @inject('AppointmentsRepository')
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

        const currentDate = new Date(Date.now());

        const availability = eachHourArray.map(hour => {

            const hasAppointmentInHour = appointments.find(appointment =>
                getHours(appointment.date) === hour,
            )

            const comparetDate = new Date(year, month - 1, day, hour);

            return {
                hour,
                available: !hasAppointmentInHour && isAfter(comparetDate, currentDate)
            }
        })

        return availability;
    }
}

export default ListProviderDayAvailanilityService;
