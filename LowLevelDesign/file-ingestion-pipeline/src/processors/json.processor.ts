import { FileProcessor } from "./file-processor.interface";

export class JsonProcessor implements FileProcessor {
    process(fileContent: string): void {
        console.log("Processing JSON File");
    }
}