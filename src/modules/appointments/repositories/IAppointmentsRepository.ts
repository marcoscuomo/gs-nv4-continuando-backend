import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMounthFromProviderDTO from '../dtos/IFindAllInMounthFromProviderDTO';

export default interface IAppointmentRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>;
    findAllInMounthFromProvider(date: IFindAllInMounthFromProviderDTO): Promise<Appointment[]>;
}
