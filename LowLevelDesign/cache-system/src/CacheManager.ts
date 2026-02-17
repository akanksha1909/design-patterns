import { KeyBasedExecutor } from "./Executors/KeyBasedExecutor";

export class CacheManager {
    private static instance;
    private cacheStorage;
    private dbStorage;
    private writePolicy;
    private evictionAlgorithm;
    private keyBasedExecutor;

    private constructor(cacheStorage, dbStorage, writePolicy, evictionAlgorithm, numExecutors) {
        this.cacheStorage = cacheStorage;
        this.dbStorage = dbStorage;
        this.writePolicy = writePolicy;
        this.evictionAlgorithm = evictionAlgorithm;
        this.keyBasedExecutor = new KeyBasedExecutor(numExecutors);
    }

    static getInstance(cacheStorage, dbStorage, writePolicy, evictionAlgorithm, numExecutors): CacheManager {
        if (CacheManager.instance == null) {
            CacheManager.instance = new CacheManager(cacheStorage, dbStorage, writePolicy, evictionAlgorithm, numExecutors)
        }
        return CacheManager.instance
    }

    /**
     * Reads data from the cache for the given key.
     * Updates the eviction algorithm as the key is accessed.
     */
    accessData(key) {
        return this.keyBasedExecutor.submitTask(key, async () => {
            await this.evictionAlgorithm.keyAccessed(key);
            return this.cacheStorage.get(key)
        })
    }

    /**
     * Writes (or updates) data in both the cache and DB storage using the write-through policy.
     * If the key is new and the cache is at capacity, evicts the least recently used key from the cache.
     */
    updateData(key, value) {
        return this.keyBasedExecutor.submitTask(key, async () => {
            const containsKey = this.cacheStorage.containsKey(key)
            if (containsKey) {
                await this.writePolicy.write(key, value, this.cacheStorage, this.dbStorage);
                await this.evictionAlgorithm.keyAccessed(key);
            } else {
                const size = this.cacheStorage.size();
                const capacity = this.cacheStorage.getCapacity();
                if (size >= capacity) {
                    const evictKey = await this.evictionAlgorithm.evictKey()
                    if (evictKey) {
                        const currentIndex = this.keyBasedExecutor.getExecutorIndexForKey(key);
                        const evictKeyIndex = this.keyBasedExecutor.getExecutorIndexForKey(evictKey);
                        if (currentIndex == evictKeyIndex) {
                            this.cacheStorage.remove(evictKey)
                        } else {
                            this.keyBasedExecutor.submitTask(evictKey, async () => {
                                this.cacheStorage.remove(evictKey)
                            })
                        }
                    }
                }
                // Write the new key/value concurrently to both storages.
                await this.writePolicy.write(key, value, this.cacheStorage, this.dbStorage);
                await this.evictionAlgorithm.keyAccessed(key);
            }
        })
    }

    shutdown() {
        this.keyBasedExecutor.shutdown();
    }
}