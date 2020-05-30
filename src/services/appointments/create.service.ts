import { startOfHour } from 'date-fns';

import Appointment from '@models/appointment.model';
import AppointmentsRepository from '@repositories/appointments.repository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: Request): Appointment {
    const appointmentDate = startOfHour(date);
    const appointmentBooked = this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if (appointmentBooked) {
      throw Error('This appointment is already booked');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate
    });

    return appointment;
  }
}

export default CreateAppointmentService;
