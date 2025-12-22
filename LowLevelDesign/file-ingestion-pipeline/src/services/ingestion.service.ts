import { validationService } from "./validation.service";
import { fileRepository } from "../repositories/file.repository";
import { FileStatus } from "../enums/file-status.enum";
import { queue } from "../queues/queue";

class IngestionService {
    ingest(fileName: string, size: number) {
        validationService.validate(fileName, size);
        const fileType = fileName.split(".")[0];
        const metadata = fileRepository.save(fileName, fileType, size);
        fileRepository.updateStatus(metadata.id, FileStatus.VALIDATED);
        queue.publish(metadata.id);
        return metadata;
    }
}

export const ingestionService = new IngestionService();