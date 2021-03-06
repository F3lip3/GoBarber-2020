import { classToClass } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  year: number;
  month: number;
  day: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;
    const cachedAppointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey
    );
    if (cachedAppointments) {
      return cachedAppointments;
    }

    const appointments = await this.appointmentsRepository.findAllByDayAndProvider(
      {
        provider_id,
        year,
        month,
        day
      }
    );

    await this.cacheProvider.save(cacheKey, classToClass(appointments));

    return appointments;
  }
}

export default ListProviderAppointmentsService;
