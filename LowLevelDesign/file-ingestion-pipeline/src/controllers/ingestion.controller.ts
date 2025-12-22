import { Request, Response } from "express";
import { ingestionService } from "../services/ingestion.service";

class IngestionController {
    ingest(req: Request, res: Response) {
        const { fileName, size } = req.body;
        const result = ingestionService.ingest(fileName, size);
        res.json(result)
    }
}

export const ingestionController = new IngestionController();

