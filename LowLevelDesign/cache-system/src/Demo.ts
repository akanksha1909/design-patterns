import { CacheManager } from "./CacheManager"
import { LRUEviction } from "./EvictionAlgorithms/LRUEviction";
import { InMemoryCacheStorage } from "./InMemoryCacheStorage/InMemoryCacheStorage";
import { SimpleDBStorage } from "./SimpleDBStorage/SimpleDBStorage";
import { WriteThroughPolicy } from "./WritePolicies/WriteThroughPolicy";

class Demo {
    async run() {
        const cacheStorage = new InMemoryCacheStorage(5);
        const dbStorage = new SimpleDBStorage();
        const writePolicy = new WriteThroughPolicy();
        const evictionAlgorithm = new LRUEviction();

        const cacheManager = CacheManager.getInstance(cacheStorage, dbStorage, writePolicy, evictionAlgorithm, 4);


        // Demonstrate write operations.
        await cacheManager.updateData('A', 'Apple');
        await cacheManager.updateData('B', 'Banana');
        await cacheManager.updateData('C', 'Cherry');
        await cacheManager.updateData('D', 'Durian');
        await cacheManager.updateData('E', 'Elderberry');

        // At this point, the in-memory cache is at capacity.
        // The next write will trigger eviction (of the least recently used key) from the cache.
        await cacheManager.updateData('F', 'Fig');


        // Demonstrate read operations.
        try {
            const valueA = await cacheManager.accessData('A');
            console.log('A:', valueA);
        } catch (e) {
            console.log('A is evicted or not found in cache.');
        }

        const valueF = await cacheManager.accessData('F');
        console.log('F:', valueF);

        // Update an existing key and then read it to demonstrate read-your-own-writes.
        await cacheManager.updateData('B', 'Blueberry');
        const valueB = await cacheManager.accessData('B');
        console.log('B:', valueB);


        // Shut down executors when finished.
        cacheManager.shutdown();
    }
}

new Demo().run()