export interface DBStorage {
    write(key, value);
    read(key);
    delete(key);
}