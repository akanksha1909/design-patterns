import { TaskScheduler } from "./TaskScheduler.js";
import { randomUUID } from "crypto";

const scheduler = new TaskScheduler(4);

let taskCount = 0;

const interval = setInterval(() => {
    taskCount += 1;
    scheduler.submit({
        id: randomUUID(),
        type: "image-process",
        payload: {
            imageName: `image_${taskCount}.png`
        }
    });
    if (taskCount == 10) {
        clearInterval(interval);
    }
}, 200);
