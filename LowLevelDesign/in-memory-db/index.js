import { Version } from "./version.js";

class InMemoryDB {

    constructor() {
        this.inmemoryData = new Map() // key: Map<field, value>
    }

    Set(key, field, value) {
        if (!this.inmemoryData.has(key)) {
            this.inmemoryData.set(key, new Map())
        }
        const keyObj = this.inmemoryData.get(key)
        keyObj.set(field, [new Version(value, 0)]);
    }

    Get(key, field) {
        if (!this.inmemoryData.has(key)) {
            return null
        }
        const keyObj = this.inmemoryData.get(key)
        if (!keyObj.has(field)) {
            return null
        }
        return keyObj.get(field)[0].value
    }

    Delete(key, field) {
        if (!this.inmemoryData.has(key)) {
            return false
        }
        const keyObj = this.inmemoryData.get(key)
        if (!keyObj.has(field)) {
            return false
        }
        keyObj.delete(field)
        if (keyObj.size === 0) {
            this.inmemoryData.delete(key);
        }
        return true
    }

    Scan(key) {
        if (!this.inmemoryData.has(key)) {
            return []
        }
        const keyObj = this.inmemoryData.get(key)
        const result = []
        for (let field of keyObj.keys()) {
            let value = keyObj.get(field)[0].value
            result.push(`${field}(${value})`)
        }
        result.sort();
        return result;
    }

    ScanByPrefix(key, prefix) {
        if (!this.inmemoryData.has(key)) {
            return []
        }
        const keyObj = this.inmemoryData.get(key)
        const result = []
        for (let field of keyObj.keys()) {
            let value = keyObj.get(field)[0].value
            if (field.startsWith(prefix)) {
                result.push(`${field}(${value})`)
            }
        }
        result.sort();
        return result;
    }

    SetAt(key, field, value, timestamp) {
        if (!this.inmemoryData.has(key)) {
            this.inmemoryData.set(key, new Map())
        }
        const keyObj = this.inmemoryData.get(key)
        if (!keyObj.has(field)) {
            keyObj.set(field, [])
        }
        keyObj.get(field).push(new Version(value, timestamp))
    }

    SetAtWithTtl(key, field, value, timestamp, ttl) {
        if (!this.inmemoryData.has(key)) {
            this.inmemoryData.set(key, new Map())
        }
        const keyObj = this.inmemoryData.get(key)
        if (!keyObj.has(field)) {
            keyObj.set(field, [])
        }
        keyObj.get(field).push(new Version(value, timestamp, timestamp + ttl))

    }

    DeleteAt(key, field, timestamp) {
        if (!this.inmemoryData.has(key)) {
            return false
        }
        const keyObj = this.inmemoryData.get(key)
        if (!keyObj.has(field)) {
            return false
        }
        if (this.GetAt(key, field, timestamp) === null) {
            return false
        }
        keyObj.get(field).push(
            new Version(null, timestamp, timestamp)
        );
        return true
    }

    GetAt(key, field, timestamp) {
        if (!this.inmemoryData.has(key)) {
            return null
        }
        const keyObj = this.inmemoryData.get(key)
        if (!keyObj.has(field)) {
            return null
        }
        const versions = keyObj.get(field)
        for (let i = versions.length - 1; i >= 0; i--) {
            if (versions[i].isAlive(timestamp)) {
                return versions[i].value
            }
        }
        return null;
    }

    ScanAt(key, timestamp) {
        if (!this.inmemoryData.has(key)) {
            return []
        }
        const keyObj = this.inmemoryData.get(key)
        const result = []
        for (let field of keyObj.keys()) {
            let value = this.GetAt(key, field, timestamp)
            if (value != null) {
                result.push(`${field}(${value})`)
            }
        }
        result.sort();
        return result;
    }

    ScanPrefixAt(key, prefix, timestamp) {
        if (!this.inmemoryData.has(key)) {
            return []
        }
        const keyObj = this.inmemoryData.get(key)
        const result = []
        for (let field of keyObj.keys()) {
            if (!field.startsWith(prefix)) {
                continue
            }
            let value = this.GetAt(key, field, timestamp)
            if (value != null) {
                result.push(`${field}(${value})`)
            }
        }
        result.sort();
        return result;
    }
}