import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IAppointmentRepository from '../repositories/IAppointmentsRepository'

interface IRequestDTO {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMounthAvailanilityService {

    constructor(
        @inject('AppointmentRepository')
        private appointmentRepository: IAppointmentRepository
        ){}

    public async execute({ provider_id, month, year }: IRequestDTO): Promise<IResponse>{
        const appointments = await this.appointmentRepository.findAllInMounthFromProvider({
            provider_id,
            year,
            month
        });

        // console.log(appintments);

        const numberOfDaysInMonth = getDaysInMonth(
            new Date(year, month -1)
        );

        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        );



        console.log(eachDayArray);

        const availability = eachDayArray.map(day => {
            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day;
            });

            return {
                day,
                available: appointmentsInDay.length < 10,
            }
        });

        return availability;

        // return [{day: 1, available: false}];
    }
}

export default ListProviderMounthAvailanilityService;
