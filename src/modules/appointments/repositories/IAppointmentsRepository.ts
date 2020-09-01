import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllByDayAndProviderDTO from '../dtos/IFindAllByDayAndProviderDTO';
import IFindAllByMonthAndProviderDTO from '../dtos/IFindAllByMonthAndProviderDTO';
import Appointment from '../infra/typeorm/entities/Appointment';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findAllByDayAndProvider(
    data: IFindAllByDayAndProviderDTO
  ): Promise<Appointment[]>;
  findAllByMonthAndProvider(
    data: IFindAllByMonthAndProviderDTO
  ): Promise<Appointment[]>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
}
