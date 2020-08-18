import { getHours, isAfter } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
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
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllByDayAndProvider(
      {
        provider_id,
        year,
        month,
        day
      }
    );

    const hourStart = 8;
    const hoursInDay = Array.from(
      { length: 10 },
      (_, index) => index + hourStart
    );

    const currentDate = new Date(Date.now());
    const availability = hoursInDay.map(hour => {
      const compareDate = new Date(year, month - 1, day, hour);
      const hasAppointmentInHour = appointments.some(
        appointment => getHours(appointment.date) === hour
      );

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate)
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
