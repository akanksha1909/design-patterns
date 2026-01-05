import type { CreateAppointment } from "../types/createAppointment.type.js";
import { appointmentRepository } from "../repositories/appointment.repository.js";
import { fromUTC, toUTC } from '../utils/time.util.js';

class AppointmentService {
    create(appointmentDetails: CreateAppointment) {
        const { hostId, guestId, timezone, startTime, durationInMins } = appointmentDetails;

        const startTimeUTC = toUTC(startTime, timezone)!;
        const endTimeUTC = toUTC(new Date(new Date(startTime).getTime() + durationInMins * 60000).toISOString(), timezone)!;

        const doesOverlap = appointmentRepository.checkForConflicts(hostId, startTimeUTC, endTimeUTC);
        if (doesOverlap) {
            throw new Error("Booking already exists for a given period.")
        }

        // Check Conflict with existing appointments
        appointmentRepository.save(hostId, guestId, startTimeUTC, endTimeUTC);
    }

    list(hostId: string) {
        const appointments = appointmentRepository.getAllAppointments(hostId);
        if (!appointments) {
            return [];
        }

        console.log("aaaaa", appointments)

        // When using arrow functions, object literals must be wrapped in parentheses to enable implicit return. 
        // Otherwise, JavaScript treats the braces as a function block.
        return appointments.map(appointment => ({
            guestId: appointment.guestId,
            startTime: fromUTC(appointment.startTimeUTC, "Asia/Kolkata"),
            endTime: fromUTC(appointment.endTimeUTC, "Asia/Kolkata"),
        }));
    }
}

export const appointmentService = new AppointmentService();