import { RateLimiter } from '../RateLimiter';
import { TokenBucketStrategy } from '../strategies/TokenBucketStrategy';
import { FixedWindowStrategy } from '../strategies/FixedWindowStrategy';
import { SlidingWindowStrategy } from '../strategies/SlidingWindowStrategy';

/**
 * Basic usage examples demonstrating the Strategy pattern
 */
async function basicUsageExamples() {
  console.log('=== Basic Usage Examples ===\n');

  // Example 1: Token Bucket Strategy
  console.log('1. Token Bucket Strategy:');
  const tokenBucketStrategy = new TokenBucketStrategy(
    10,      // Max 10 tokens
    2        // 2 tokens per second
  );
  const rateLimiter1 = new RateLimiter(tokenBucketStrategy);

  const user1 = 'user-123';
  for (let i = 0; i < 12; i++) {
    const allowed = await rateLimiter1.allowRequest(user1);
    const state = await rateLimiter1.getState(user1);
    console.log(`Request ${i + 1}: ${allowed ? 'ALLOWED' : 'DENIED'} | Remaining: ${state.remainingRequests}`);
  }

  console.log('\n2. Fixed Window Strategy:');
  const fixedWindowStrategy = new FixedWindowStrategy(
    5,       // Max 5 requests
    10000    // Per 10 seconds
  );
  const rateLimiter2 = new RateLimiter(fixedWindowStrategy);

  const user2 = 'user-456';
  for (let i = 0; i < 7; i++) {
    const allowed = await rateLimiter2.allowRequest(user2);
    const state = await rateLimiter2.getState(user2);
    console.log(`Request ${i + 1}: ${allowed ? 'ALLOWED' : 'DENIED'} | Remaining: ${state.remainingRequests}`);
  }

  console.log('\n3. Strategy Pattern - Changing Strategy at Runtime:');
  const rateLimiter3 = new RateLimiter(tokenBucketStrategy);
  console.log('Initial strategy:', rateLimiter3.getStrategy().constructor.name);
  
  rateLimiter3.setStrategy(new SlidingWindowStrategy(5, 10000));
  console.log('Changed strategy:', rateLimiter3.getStrategy().constructor.name);
}

// Run examples
basicUsageExamples().catch(console.error);
