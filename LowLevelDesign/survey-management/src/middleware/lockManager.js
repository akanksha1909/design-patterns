class LockManager {
  constructor() {
    this.locks = new Map(); // questionId -> { locked: boolean, queue: [] }
  }

  async acquireLock(questionId) {
    return new Promise((resolve) => {
      if (!this.locks.has(questionId)) {
        this.locks.set(questionId, { locked: false, queue: [] });
      }

      const lock = this.locks.get(questionId);

      if (!lock.locked) {
        lock.locked = true;
        resolve();
      } else {
        lock.queue.push(resolve);
      }
    });
  }

  releaseLock(questionId) {
    const lock = this.locks.get(questionId);
    if (!lock) return;

    lock.locked = false;

    if (lock.queue.length > 0) {
      const nextResolve = lock.queue.shift();
      lock.locked = true;
      nextResolve();
    } else {
      this.locks.delete(questionId);
    }
  }
}

module.exports = new LockManager();

