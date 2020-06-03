import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AuthMiddleware from '@middlewares/auth.middleware';
import AppointmentsRepository from '@repositories/appointments.repository';
import CreateAppointmentService from '@services/appointments/create.service';

const appointmentsRouter = Router();

appointmentsRouter.use(AuthMiddleware);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);
  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.execute({
    provider_id,
    date: parsedDate
  });

  return response.json(appointment);
});

export default appointmentsRouter;
