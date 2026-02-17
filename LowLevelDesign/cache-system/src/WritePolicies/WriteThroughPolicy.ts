import { WritePolicy } from "./WritePolicy";

export class WriteThroughPolicy implements WritePolicy {
    async write(key, value, cacheStorage, dbStorage): Promise<void> {
        const cachePromise = Promise.resolve().then(() => {
            cacheStorage.put(key, value)
        })

        const dbPromise = Promise.resolve().then(() => {
            dbStorage.write(key, value)
        })

        await Promise.all([cachePromise, dbPromise])
    }
}