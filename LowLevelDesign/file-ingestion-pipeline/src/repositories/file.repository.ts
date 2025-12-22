import { FileStatus } from '../enums/file-status.enum';
import { FileMetadata } from '../models/file.model';
import { v4 as uuid } from "uuid";

class FileRepository {
    private files = new Map<string, FileMetadata>();

    save(fileName: string, fileType: string, size: number) {
        const metadata = {
            id: uuid(),
            fileName,
            fileType,
            size,
            status: FileStatus.UPLOADED,
            createdAt: new Date()
        }

        this.files.set(metadata.id, metadata);
        return metadata;
    }

    getById(id: string): FileMetadata | undefined {
        return this.files.get(id);
    }

    updateStatus(id: string, status: FileStatus): void {
        const file = this.files.get(id);
        if (file) {
            file.status = status;
        }
    }
}

export const fileRepository = new FileRepository();