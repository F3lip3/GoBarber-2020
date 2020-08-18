import { getRepository, Repository, Raw } from 'typeorm';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllByDayAndProviderDTO from '@modules/appointments/dtos/IFindAllByDayAndProviderDTO';
import IFindAllByMonthAndProviderDTO from '@modules/appointments/dtos/IFindAllByMonthAndProviderDTO';
import IAppointementsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointementsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({
    provider_id,
    date
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = await this.ormRepository.create({
      provider_id,
      date
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findAllByDayAndProvider({
    provider_id,
    year,
    month,
    day
  }: IFindAllByDayAndProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'YYYY-MM-DD') = '${year}-${parsedMonth}-${parsedDay}'`
        )
      }
    });

    return appointments;
  }

  public async findAllByMonthAndProvider({
    provider_id,
    year,
    month
  }: IFindAllByMonthAndProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'YYYY-MM') = '${year}-${parsedMonth}'`
        )
      }
    });

    return appointments;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date }
    });

    return findAppointment;
  }
}

export default AppointmentsRepository;
