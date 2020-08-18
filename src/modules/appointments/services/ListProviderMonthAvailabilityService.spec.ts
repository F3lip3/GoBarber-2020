import { uuid } from 'uuidv4';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list the month availability', async () => {
    const provider_id = uuid();

    const fakes: Promise<Appointment>[] = [];
    // eslint-disable-next-line no-plusplus
    for (let index = 8; index < 18; index++) {
      fakes.push(
        fakeAppointmentsRepository.create({
          provider_id,
          date: new Date(2020, 7, 18, index, 0, 0)
        })
      );
    }
    await Promise.all(fakes);

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 7, 19, 10, 0, 0)
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id,
      year: 2020,
      month: 8
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 17, available: true },
        { day: 18, available: false },
        { day: 19, available: true },
        { day: 20, available: true }
      ])
    );
  });
});
