import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import { uuid } from 'uuidv4';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllByDayAndProviderDTO from '@modules/appointments/dtos/IFindAllByDayAndProviderDTO';
import IFindAllByMonthAndProviderDTO from '@modules/appointments/dtos/IFindAllByMonthAndProviderDTO';
import IAppointementsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '../../infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointementsRepository {
  private appointments: Appointment[] = [];

  public async create({
    provider_id,
    user_id,
    date
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      id: uuid(),
      date,
      provider_id,
      user_id
    });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findAllByDayAndProvider({
    provider_id,
    year,
    month,
    day
  }: IFindAllByDayAndProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) + 1 === month &&
        getDate(appointment.date) === day
    );

    return appointments;
  }

  public async findAllByMonthAndProvider({
    provider_id,
    year,
    month
  }: IFindAllByMonthAndProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
    );

    return appointments;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date)
    );

    return findAppointment;
  }
}

export default FakeAppointmentsRepository;
