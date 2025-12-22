export interface FileProcessor {
    process(fileContent: string): void;
}