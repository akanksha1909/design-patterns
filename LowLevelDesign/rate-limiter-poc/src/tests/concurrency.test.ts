import { RateLimiter } from '../RateLimiter';
import { TokenBucketStrategy } from '../strategies/TokenBucketStrategy';
import { FixedWindowStrategy } from '../strategies/FixedWindowStrategy';

/**
 * Concurrency Tests
 * These tests verify that the rate limiter correctly handles concurrent requests
 * without race conditions
 */

describe('Concurrency Tests', () => {
  test('Token Bucket: Concurrent requests should respect capacity', async () => {
    const strategy = new TokenBucketStrategy(5, 1);
    const rateLimiter = new RateLimiter(strategy);
    const userId = 'test-user';

    // Make 20 concurrent requests
    const promises = Array.from({ length: 20 }, () =>
      rateLimiter.allowRequest(userId)
    );

    const results = await Promise.all(promises);
    const allowedCount = results.filter(Boolean).length;

    // Should only allow 5 requests (bucket capacity)
    expect(allowedCount).toBe(5);

    // Verify final state
    const state = await rateLimiter.getState(userId);
    expect(state.remainingRequests).toBe(0);
  });

  test('Token Bucket: No race condition with rapid requests', async () => {
    const strategy = new TokenBucketStrategy(10, 1);
    const rateLimiter = new RateLimiter(strategy);
    const userId = 'rapid-user';

    // Make 100 rapid concurrent requests
    const promises = Array.from({ length: 100 }, () =>
      rateLimiter.allowRequest(userId)
    );

    const results = await Promise.all(promises);
    const allowedCount = results.filter(Boolean).length;

    // Should never exceed capacity
    expect(allowedCount).toBeLessThanOrEqual(10);
    expect(allowedCount).toBeGreaterThanOrEqual(0);
  });

  test('Fixed Window: Concurrent requests should respect limit', async () => {
    const strategy = new FixedWindowStrategy(5, 10000);
    const rateLimiter = new RateLimiter(strategy);
    const userId = 'window-user';

    // Make 10 concurrent requests
    const promises = Array.from({ length: 10 }, () =>
      rateLimiter.allowRequest(userId)
    );

    const results = await Promise.all(promises);
    const allowedCount = results.filter(Boolean).length;

    // Should only allow 5 requests
    expect(allowedCount).toBe(5);
  });

  test('Multiple users should have independent buckets', async () => {
    const strategy = new TokenBucketStrategy(5, 1);
    const rateLimiter = new RateLimiter(strategy);

    const users = ['user-1', 'user-2', 'user-3'];
    const requestsPerUser = 10;

    // Create concurrent requests for multiple users
    const allPromises = users.flatMap(userId =>
      Array.from({ length: requestsPerUser }, () =>
        rateLimiter.allowRequest(userId)
      )
    );

    const results = await Promise.all(allPromises);

    // Group by user
    let index = 0;
    for (const userId of users) {
      const userResults = results.slice(index, index + requestsPerUser);
      const allowed = userResults.filter(Boolean).length;
      expect(allowed).toBe(5); // Each user should get 5 allowed
      index += requestsPerUser;
    }
  });

  test('Token refill should work correctly under concurrency', async () => {
    const strategy = new TokenBucketStrategy(5, 10); // High refill rate
    const rateLimiter = new RateLimiter(strategy);
    const userId = 'refill-user';

    // Consume all tokens
    for (let i = 0; i < 5; i++) {
      await rateLimiter.allowRequest(userId);
    }

    // Wait a bit for refill
    await new Promise(resolve => setTimeout(resolve, 200));

    // Make concurrent requests after refill
    const promises = Array.from({ length: 10 }, () =>
      rateLimiter.allowRequest(userId)
    );

    const results = await Promise.all(promises);
    const allowedCount = results.filter(Boolean).length;

    // Should have refilled some tokens
    expect(allowedCount).toBeGreaterThan(0);
  });
});
