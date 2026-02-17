export interface WritePolicy {
    write(key, value, cacheStorage, dbStorage);
}