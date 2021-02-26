import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMounthFromProviderDTO from '../dtos/IFindAllInMounthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>;
    findAllInMounthFromProvider(data: IFindAllInMounthFromProviderDTO): Promise<Appointment[]>;
    findAllInDayFromProvider(data: IFindAllInDayFromProviderDTO) :Promise<Appointment[]>
}
