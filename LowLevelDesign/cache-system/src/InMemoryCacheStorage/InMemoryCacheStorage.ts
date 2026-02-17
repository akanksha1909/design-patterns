import { CacheStorage } from './CacheStorage';

export class InMemoryCacheStorage implements CacheStorage {
    private capacity;
    private cache;

    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    put(key, value) {
        this.cache.set(key, value)
    }

    get(key) {
        if (!this.cache.has(key)) {
            throw new Error(`Key not included in cache: ${key}`)
        }
        return this.cache.get(key)
    }

    remove(key) {
        if (!this.cache.has(key)) {
            throw new Error(`Key not included in cache: ${key}`)
        }
        this.cache.delete(key)
    }

    containsKey(key) {
        return this.cache.has(key)
    }

    size() {
        return this.cache.size;
    }

    getCapacity() {
        return this.capacity;
    }
}