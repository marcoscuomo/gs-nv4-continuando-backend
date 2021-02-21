import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export default interface IUserRepository {
    findById(id: string): Promise<User | undefined>;
    findyByEmail(email: string): Promise<User | undefined>;
    create(data: ICreateUserDTO): Promise<User>;
    save(user: User): Promise<User>;
}
