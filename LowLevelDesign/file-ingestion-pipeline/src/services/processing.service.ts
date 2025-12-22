import { FileStatus } from "../enums/file-status.enum";
import { ProcessorFactory } from "../processors/processor.factory";
import { fileRepository } from "../repositories/file.repository";

class ProcessingService {
    process(fileId: string): void {
        const file = fileRepository.getById(fileId);
        if (!file) {
            return;
        }
        try {
            fileRepository.updateStatus(fileId, FileStatus.PROCESSING);
            const processor = ProcessorFactory.getProcessor(file.fileType);
            processor.process("dummy-content");
            fileRepository.updateStatus(fileId, FileStatus.COMPLETED);
        } catch (err) {
            fileRepository.updateStatus(fileId, FileStatus.FAILED);
        }
    }
}

export const processingService = new ProcessingService();