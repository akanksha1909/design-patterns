import { Router } from 'express';
import { ingestionController } from '../controllers/ingestion.controller';

const router = Router();

router.post("/upload", (req, res) => {
    ingestionController.ingest(req, res)
});

export default router;
