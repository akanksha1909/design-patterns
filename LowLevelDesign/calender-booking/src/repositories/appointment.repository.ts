import app from "../app.js";
import type { Appointment } from "../models/appointment.model.js";
import { v4 as uuid } from 'uuid';

class AppointmentRepository {
    private appointments: Map<string, Appointment[]> = new Map();
    save(hostId: string, guestId: string, startTime: string, endTime: string) {
        const appointment = {
            id: uuid(),
            hostId,
            guestId,
            startTimeUTC: startTime,
            endTimeUTC: endTime,
            createdAt: new Date()
        }
        const existingAppointments = this.appointments.get(hostId) ?? [];
        existingAppointments.push(appointment);
        this.appointments.set(hostId, existingAppointments);
        console.log("app", this.appointments)
    }

    checkForConflicts(hostId: string, startTime: string, endTime: string): boolean {
        const appointments = this.appointments.get(hostId);
        if (!appointments) {
            return false;
        }
        for (const appointment of appointments) {
            const as = appointment.startTimeUTC;
            const ae = appointment.endTimeUTC;

            if (startTime < ae && endTime > as) {
                return true;
            }
        }
        return false;
    }

    getAllAppointments(hostId: string) {
        console.log("This appo", this.appointments, typeof hostId)
        return this.appointments.get(hostId);
    }
}

export const appointmentRepository = new AppointmentRepository();