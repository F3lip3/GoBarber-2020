import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const fakeNotificationsRepository = new FakeNotificationsRepository();
    const fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 19, 10).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 7, 19, 11),
      user_id: '321321',
      provider_id: '123123'
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointments in the same time', async () => {
    const appointmentDate = new Date(2020, 7, 19, 16);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 7, 19, 10).getTime();
    });

    await createAppointment.execute({
      date: appointmentDate,
      user_id: '321321',
      provider_id: '123123'
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: '321321',
        provider_id: '123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 19, 10).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 19, 9),
        user_id: '321321',
        provider_id: '123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment when the user is the provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 19, 10).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 19, 11),
        user_id: '123123',
        provider_id: '123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8h and after 17h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 19, 10).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 20, 7),
        user_id: 'user-id',
        provider_id: 'provider-id'
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 20, 18),
        user_id: 'user-id',
        provider_id: 'provider-id'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
