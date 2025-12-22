import express from 'express';
import ingestionRoutes from './routes/ingestion.routes';

const app = express();
app.use(express.json());

app.use("/ingest", ingestionRoutes);


export default app;