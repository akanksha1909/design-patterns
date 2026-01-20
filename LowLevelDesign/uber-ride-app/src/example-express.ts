import express, { Request, Response } from 'express';
import { UberRideApp } from './UberRideApp';

/**
 * Example Express server setup using ES6 imports
 */
const app = express();
const port = 3000;

app.use(express.json());

const uberApp = new UberRideApp();

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;

