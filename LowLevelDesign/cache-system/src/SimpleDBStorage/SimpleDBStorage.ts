import { DBStorage } from "./DBStorage";

export class SimpleDBStorage implements DBStorage {
    private database;
    constructor() {
        this.database = new Map();
    }

    write(key, value) {
        this.database.set(key, value)
    }

    read(key) {
        if (!this.database.has(key)) {
            throw new Error(`Key not found in DB: ${key}`);
        }
        return this.database.get(key)!;
    }

    delete(key) {
        if (!this.database.has(key)) {
            throw new Error(`Key not found in DB: ${key}`);
        }
        this.database.delete(key);
    }
}