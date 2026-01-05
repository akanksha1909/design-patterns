import express from 'express';
import appointmentRouter from './routes/appointment.route.js';


const app = express();

app.use(express.json());
app.use(appointmentRouter);

export default app;