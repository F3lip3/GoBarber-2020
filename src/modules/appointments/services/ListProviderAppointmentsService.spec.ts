import { uuid } from 'uuidv4';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list appointments of a provider', async () => {
    const provider_id = uuid();
    const user_id = uuid();

    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 7, 19, 10, 0, 0)
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 7, 19, 13, 0, 0)
    });

    const appointments = await listProviderAppointments.execute({
      provider_id,
      year: 2020,
      month: 8,
      day: 19
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
