export class Version {
    constructor(value, start = null, end = null) {
        this.value = value
        this.start = start
        this.end = end
    }

    isAlive(ts) {
        if (ts < this.start) {
            return false
        }
        if (this.expiry != null && this.expiry < ts) {
            return false
        }
        return true
    }
}

