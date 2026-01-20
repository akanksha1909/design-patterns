import { RateLimiterStrategy, RateLimiterState } from '../interfaces/RateLimiterStrategy';
import { AsyncLock } from '../utils/AsyncLock';

/**
 * Token Bucket Strategy Implementation
 * 
 * Algorithm:
 * - Tokens are added to a bucket at a fixed rate (refill rate)
 * - Each request consumes one token
 * - If bucket is empty, request is denied
 * - Bucket has a maximum capacity
 * 
 * Concurrency Handling:
 * - Uses AsyncLock to ensure thread-safe token operations
 * - Prevents race conditions when multiple requests check/consume tokens simultaneously
 */
export class TokenBucketStrategy implements RateLimiterStrategy {
  private buckets: Map<string, TokenBucket> = new Map();
  private lock: AsyncLock = new AsyncLock();

  /**
   * @param capacity - Maximum number of tokens the bucket can hold
   * @param refillRate - Number of tokens added per second
   */
  constructor(
    private readonly capacity: number,
    private readonly refillRate: number // tokens per second
  ) {
    if (capacity <= 0 || refillRate <= 0) {
      throw new Error('Capacity and refill rate must be positive');
    }
  }

  /**
   * Check if a request should be allowed
   * Uses lock to ensure atomic token check and consumption
   */
  async allowRequest(identifier: string): Promise<boolean> {
    return this.lock.execute(identifier, async () => {
      const bucket = this.getOrCreateBucket(identifier);
      const now = Date.now();

      // Refill tokens based on elapsed time
      this.refillTokens(bucket, now);

      // Check if we have tokens available
      if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        bucket.lastRefill = now;
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
      const bucket = this.getOrCreateBucket(identifier);
      const now = Date.now();

      // Refill tokens based on elapsed time
      this.refillTokens(bucket, now);

      const allowed = bucket.tokens >= 1;
      const remainingRequests = Math.floor(bucket.tokens);

      // Calculate retry after time if bucket is empty
      let retryAfter: number | undefined;
      if (bucket.tokens < 1) {
        const tokensNeeded = 1 - bucket.tokens;
        retryAfter = Math.ceil(tokensNeeded / this.refillRate);
      }

      // Calculate reset time (when bucket will be full)
      const tokensToFull = this.capacity - bucket.tokens;
      const resetTime = tokensToFull > 0 
        ? now + Math.ceil((tokensToFull / this.refillRate) * 1000)
        : now;

      return {
        allowed,
        remainingRequests,
        retryAfter,
        resetTime,
      };
    });
  }

  /**
   * Get or create a token bucket for the identifier
   */
  private getOrCreateBucket(identifier: string): TokenBucket {
    if (!this.buckets.has(identifier)) {
      this.buckets.set(identifier, {
        tokens: this.capacity,
        lastRefill: Date.now(),
      });
    }
    return this.buckets.get(identifier)!;
  }

  /**
   * Refill tokens based on elapsed time since last refill
   */
  private refillTokens(bucket: TokenBucket, now: number): void {
    const elapsedSeconds = (now - bucket.lastRefill) / 1000;
    const tokensToAdd = elapsedSeconds * this.refillRate;

    // Add tokens, but don't exceed capacity
    bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }
}

/**
 * Internal representation of a token bucket
 */
interface TokenBucket {
  tokens: number;
  lastRefill: number; // Unix timestamp in milliseconds
}
