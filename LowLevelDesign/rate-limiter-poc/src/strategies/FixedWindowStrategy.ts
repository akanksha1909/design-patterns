import { RateLimiterStrategy, RateLimiterState } from '../interfaces/RateLimiterStrategy';
import { AsyncLock } from '../utils/AsyncLock';

/**
 * Fixed Window Strategy Implementation
 * 
 * Algorithm:
 * - Divides time into fixed windows (e.g., 1 minute, 1 hour)
 * - Each window has a maximum number of allowed requests
 * - Counter resets at the start of each new window
 * 
 * Concurrency Handling:
 * - Uses AsyncLock to ensure atomic counter increments
 * - Prevents race conditions when multiple requests check/increment counters simultaneously
 */
export class FixedWindowStrategy implements RateLimiterStrategy {
  private windows: Map<string, WindowCounter> = new Map();
  private lock: AsyncLock = new AsyncLock();

  /**
   * @param maxRequests - Maximum number of requests allowed per window
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
   * Uses lock to ensure atomic counter check and increment
   */
  async allowRequest(identifier: string): Promise<boolean> {
    return this.lock.execute(identifier, async () => {
      const now = Date.now();
      const window = this.getOrCreateWindow(identifier, now);

      // Check if we're in a new window
      if (now >= window.windowStart + this.windowSizeMs) {
        // Reset window
        window.count = 0;
        window.windowStart = this.getWindowStart(now);
      }

      // Check if we can allow the request
      if (window.count < this.maxRequests) {
        window.count++;
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
      const window = this.getOrCreateWindow(identifier, now);

      // Check if we're in a new window
      if (now >= window.windowStart + this.windowSizeMs) {
        window.count = 0;
        window.windowStart = this.getWindowStart(now);
      }

      const allowed = window.count < this.maxRequests;
      const remainingRequests = Math.max(0, this.maxRequests - window.count);
      const resetTime = window.windowStart + this.windowSizeMs;
      const retryAfter = allowed ? undefined : Math.ceil((resetTime - now) / 1000);

      return {
        allowed,
        remainingRequests,
        retryAfter,
        resetTime,
      };
    });
  }

  /**
   * Get or create a window counter for the identifier
   */
  private getOrCreateWindow(identifier: string, now: number): WindowCounter {
    if (!this.windows.has(identifier)) {
      this.windows.set(identifier, {
        count: 0,
        windowStart: this.getWindowStart(now),
      });
    }
    return this.windows.get(identifier)!;
  }

  /**
   * Calculate the start of the current window
   */
  private getWindowStart(timestamp: number): number {
    return Math.floor(timestamp / this.windowSizeMs) * this.windowSizeMs;
  }
}

/**
 * Internal representation of a fixed window counter
 */
interface WindowCounter {
  count: number;
  windowStart: number; // Unix timestamp in milliseconds
}
