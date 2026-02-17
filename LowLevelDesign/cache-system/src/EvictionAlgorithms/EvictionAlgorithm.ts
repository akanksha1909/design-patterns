export interface EvictionAlgorithm {
    keyAccessed(key);
    evictKey();
}