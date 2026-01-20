/**
 * Strategy interface for rate limiting algorithms
 * This allows different rate limiting algorithms to be interchangeable
 */
export interface RateLimiterStrategy {
  /**
   * Check if a request should be allowed
   * @param identifier - Unique identifier for the client/user (e.g., IP address, user ID)
   * @returns Promise<boolean> - true if request is allowed, false if rate limited
   */
  allowRequest(identifier: string): Promise<boolean>;

  /**
   * Get the current state of the rate limiter for a given identifier
   * @param identifier - Unique identifier for the client/user
   * @returns Promise<RateLimiterState> - Current state information
   */
  getState(identifier: string): Promise<RateLimiterState>;
}

/**
 * State information returned by rate limiter strategies
 */
export interface RateLimiterState {
  allowed: boolean;
  remainingRequests?: number;
  resetTime?: number; // Unix timestamp in milliseconds
  retryAfter?: number; // Seconds until next request can be made
}
