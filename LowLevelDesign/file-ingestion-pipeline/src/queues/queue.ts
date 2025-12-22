import { processingService } from "../services/processing.service";

class Queue {
    publish(fileId: string) {
        setTimeout(() => {
            processingService.process(fileId);
        }, 1000);
    }
}

export const queue = new Queue();