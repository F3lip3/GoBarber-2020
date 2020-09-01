/* eslint-disable import/no-duplicates */
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { injectable, inject } from 'tsyringe';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    user_id,
    date
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('Unable to create an appointment on a past date');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'Unable to create an appointment before 8am and after 5pm'
      );
    }

    if (user_id === provider_id) {
      throw new AppError('Unable to create an appointment to yourself');
    }

    const appointmentBooked = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id
    );
    if (appointmentBooked) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate
    });

    const formattedDate = format(appointmentDate, "dd 'de' MMMM 'às' HH'h'", {
      locale: ptBR
    });
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento dia ${formattedDate}`
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d'
      )}`
    );

    return appointment;
  }
}

export default CreateAppointmentService;
