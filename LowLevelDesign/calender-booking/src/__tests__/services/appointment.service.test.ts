import { appointmentRepository } from "../../repositories/appointment.repository.js";
import { appointmentService } from "../../services/appointment.service.js";

describe("AppointmentService", () => {

    beforeEach(() => {
        (appointmentRepository as any).appointments.clear();
    });

    it("should create an appointment successfully", () => {
        appointmentService.create({
            hostId: "1",
            guestId: "2",
            timezone: "Asia/Kolkata",
            startTime: "2025-12-02T10:00",
            durationInMins: 30,
        })
        const appointments = appointmentRepository.getAllAppointments("1");
        expect(appointments).toHaveLength(1);
    });

    it("should throw an error when appointment overlaps", () => {
       appointmentService.create({
            hostId: "1",
            guestId: "2",
            timezone: "Asia/Kolkata",
            startTime: "2025-12-02T10:00",
            durationInMins: 30,
        })
        expect(() =>  appointmentService.create({
            hostId: "1",
            guestId: "2",
            timezone: "Asia/Kolkata",
            startTime: "2025-12-02T10:00",
            durationInMins: 30,
        })).toThrow("Booking already exists for a given period.")
    });

    it("should list appointments for a host", () => {
         appointmentService.create({
            hostId: "1",
            guestId: "2",
            timezone: "Asia/Kolkata",
            startTime: "2025-12-02T10:00",
            durationInMins: 30,
        });
        const result = appointmentService.list("1");
        expect(result).toEqual([
            expect.objectContaining({
                guestId: "2"
            })
        ])
    });
});
