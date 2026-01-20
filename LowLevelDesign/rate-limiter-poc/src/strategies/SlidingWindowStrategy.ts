import { RateLimiterStrategy, RateLimiterState } from '../interfaces/RateLimiterStrategy';
import { AsyncLock } from '../utils/AsyncLock';

/**
 * Sliding Window Strategy Implementation
 * 
 * Algorithm:
 * - Maintains a log of request timestamps
 * - Only requests within the current window are counted
 * - Window slides forward with each request
 * 
 * Concurrency Handling:
 * - Uses AsyncLock to ensure atomic log operations
 * - Prevents race conditions when multiple requests add timestamps simultaneously
 */
export class SlidingWindowStrategy implements RateLimiterStrategy {
  private logs: Map<string, number[]> = new Map();
  private lock: AsyncLock = new AsyncLock();

  /**
   * @param maxRequests - Maximum number of requests allowed in the window
   * @param windowSizeMs - Size of the time window in milliseconds
   */
  constructor(
    private readonly maxRequests: number,
    private readonly windowSizeMs: number
  ) {
    if (maxRequests <= 0 || windowSizeMs <= 0) {
      throw new Error('Max requests and window size must be positive');
    }
  }

  /**
   * Check if a request should be allowed
   * Uses lock to ensure atomic log operations
   */
  async allowRequest(identifier: string): Promise<boolean> {
    return this.lock.execute(identifier, async () => {
      const now = Date.now();
      const log = this.getOrCreateLog(identifier);

      // Remove timestamps outside the current window
      this.cleanOldEntries(log, now);

      // Check if we can allow the request
      if (log.length < this.maxRequests) {
        log.push(now);
        return true;
      }

      return false;
    });
  }

  /**
   * Get the current state of the rate limiter
   */
  async getState(identifier: string): Promise<RateLimiterState> {
    return this.lock.execute(identifier, async () => {
      const now = Date.now();
      const log = this.getOrCreateLog(identifier);

      // Remove timestamps outside the current window
      this.cleanOldEntries(log, now);

      const allowed = log.length < this.maxRequests;
      const remainingRequests = Math.max(0, this.maxRequests - log.length);

      // Calculate retry after time
      let retryAfter: number | undefined;
      let resetTime: number | undefined;

      if (!allowed && log.length > 0) {
        // Oldest entry in the log will be the first to expire
        const oldestEntry = log[0];
        resetTime = oldestEntry + this.windowSizeMs;
        retryAfter = Math.ceil((resetTime - now) / 1000);
      } else {
        resetTime = now + this.windowSizeMs;
      }

      return {
        allowed,
        remainingRequests,
        retryAfter,
        resetTime,
      };
    });
  }

  /**
   * Get or create a log for the identifier
   */
  private getOrCreateLog(identifier: string): number[] {
    if (!this.logs.has(identifier)) {
      this.logs.set(identifier, []);
    }
    return this.logs.get(identifier)!;
  }

  /**
   * Remove entries outside the current window
   */
  private cleanOldEntries(log: number[], now: number): void {
    const windowStart = now - this.windowSizeMs;
    while (log.length > 0 && log[0] < windowStart) {
      log.shift();
    }
  }
}
