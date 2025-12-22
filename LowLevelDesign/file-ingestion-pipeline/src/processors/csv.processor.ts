import { FileProcessor } from "./file-processor.interface";

export class CsvProcessor implements FileProcessor {
    process(fileContent: string): void {
        console.log("Processing CSV File");
    }
}