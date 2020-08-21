import { getDaysInMonth, getDate, isAfter } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    year,
    month
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllByMonthAndProvider(
      {
        provider_id,
        year,
        month
      }
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const daysInMonth = Array.from(
      {
        length: numberOfDaysInMonth
      },
      (_, index) => index + 1
    );

    const currentDate = new Date(Date.now());
    const availability = daysInMonth.map(day => {
      const compareDate = new Date(year, month - 1, day, 17, 59);
      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day
      );

      return {
        day,
        available:
          appointmentsInDay.length < 10 && isAfter(compareDate, currentDate)
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
