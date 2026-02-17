export interface CacheStorage {
    put(key, value);
    get(key);
    remove(key);
    containsKey(key);
    size();
    getCapacity(); 
}