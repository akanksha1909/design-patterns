
import { Router, type NextFunction } from 'express';
import { appointmentController } from '../controllers/appointment.controller.js';

const appointmentRouter = Router();

appointmentRouter.post("/appointments", (req, res) => appointmentController.createBooking(req, res))

appointmentRouter.get("/appointments", (req, res) => appointmentController.getBookings(req, res));

function authMiddelware() {
    return (req, res, next) => {
        next();
    }
}

export default appointmentRouter;