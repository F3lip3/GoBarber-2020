import { Router } from 'express';
import { isEqual, parseISO, startOfHour } from 'date-fns';
import { uuid } from 'uuidv4';

interface Appointment {
  id: string;
  provider: string;
  date: Date;
}

const appointmentsRouter = Router();
const appointments: Appointment[] = [];

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));
  const appointmentBooked = appointments.some(appointment =>
    isEqual(parsedDate, appointment.date)
  );

  if (appointmentBooked) {
    return response.status(400).json({
      message: 'This appointment is already booked'
    });
  }

  const appointment = {
    id: uuid(),
    provider,
    date: parsedDate
  };

  appointments.push(appointment);

  return response.json(appointment);
});

export default appointmentsRouter;
