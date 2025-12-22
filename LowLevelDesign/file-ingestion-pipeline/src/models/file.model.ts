import { FileStatus } from "../enums/file-status.enum";

export interface FileMetadata {
    id: string;
    fileName: string;
    fileType: string;
    size: number;
    status: FileStatus;
    createdAt: Date;
}