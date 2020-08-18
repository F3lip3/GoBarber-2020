import { uuid } from 'uuidv4';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list the day availability', async () => {
    const provider_id = uuid();

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 7, 19, 8, 0, 0)
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 7, 19, 10, 0, 0)
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id,
      year: 2020,
      month: 8,
      day: 19
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
        { hour: 12, available: true }
      ])
    );
  });
});
