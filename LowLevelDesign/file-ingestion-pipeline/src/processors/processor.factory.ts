import { CsvProcessor } from "./csv.processor";
import { FileProcessor } from "./file-processor.interface";
import { JsonProcessor } from "./json.processor";

export class ProcessorFactory {
    static getProcessor(fileType: string): FileProcessor {
        if (fileType == "csv") {
            return new CsvProcessor();
        } else if (fileType == "json") {
            return new JsonProcessor();
        } else {
            throw new Error("No Processor found");
        }
    }
}