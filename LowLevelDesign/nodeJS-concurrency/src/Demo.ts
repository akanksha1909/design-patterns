import { Counter } from "./Counter";
import { Lock } from "./Lock";

class Demo {
    async run() {
        const counter = new Counter();
        const lock = new Lock();
        let operations = []
        for (let i = 0; i < 100; i++) {
            operations.push(lock.withLock(async () => {
                await counter.increment();
            }));

        }

        await Promise.all(operations)
        console.log(counter.getValue());

    }
}

new Demo().run();