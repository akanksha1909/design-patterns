import { RateLimiterStrategy, RateLimiterState } from './interfaces/RateLimiterStrategy';

/**
 * RateLimiter - Main class that uses Strategy pattern
 * 
 * This class delegates rate limiting logic to different strategy implementations.
 * The strategy can be swapped at runtime, demonstrating the Strategy pattern.
 * 
 * Benefits:
 * - Open/Closed Principle: Open for extension (new strategies), closed for modification
 * - Single Responsibility: Each strategy handles one algorithm
 * - Easy to test: Strategies can be tested independently
 */
export class RateLimiter {
  /**
   * @param strategy - The rate limiting strategy to use
   */
  constructor(private strategy: RateLimiterStrategy) {}

  /**
   * Check if a request should be allowed
   * Delegates to the current strategy
   */
  async allowRequest(identifier: string): Promise<boolean> {
    return this.strategy.allowRequest(identifier);
  }

  /**
   * Get the current state of the rate limiter
   * Delegates to the current strategy
   */
  async getState(identifier: string): Promise<RateLimiterState> {
    return this.strategy.getState(identifier);
  }

  /**
   * Change the rate limiting strategy at runtime
   * This demonstrates the flexibility of the Strategy pattern
   */
  setStrategy(strategy: RateLimiterStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Get the current strategy (for inspection/debugging)
   */
  getStrategy(): RateLimiterStrategy {
    return this.strategy;
  }
}
