import type { Request, Response } from "express";
import { appointmentService } from "../services/appointment.service.js";

class AppointmentController {

    // hostId: 1,
    // guestId: 2,
    // startTime: 2025-12-02T10:00 // T is a seperator
    // durationInMins: 30
    // timezone: "America/New_York"

    createBooking(req: Request, res: Response) {
        const appointment = appointmentService.create(req.body);
        return res.status(201).send({ message: "Appointment created successfully" });
    }

    getBookings(req: Request, res: Response) {
        const { hostId } = req.query;

        if (typeof hostId !== "string") {
            return res.status(400).json({ error: "hostId query param is required and must be string" });
        }

        const appointments = appointmentService.list(hostId);
        return res.status(200).send({ appointments });
    }
}

export const appointmentController = new AppointmentController();