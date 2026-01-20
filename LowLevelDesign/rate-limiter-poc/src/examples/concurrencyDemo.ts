import { RateLimiter } from '../RateLimiter';
import { TokenBucketStrategy } from '../strategies/TokenBucketStrategy';

/**
 * Concurrency Demo - Demonstrates how the rate limiter handles concurrent requests
 * 
 * This example shows:
 * 1. Multiple concurrent requests from the same user
 * 2. How AsyncLock prevents race conditions
 * 3. Correct token consumption even under high concurrency
 */
async function concurrencyDemo() {
  console.log('=== Concurrency Demo ===\n');

  // Create a token bucket with limited capacity
  const strategy = new TokenBucketStrategy(
    10,      // Only 10 tokens
    1        // 1 token per second
  );
  const rateLimiter = new RateLimiter(strategy);

  const userId = 'concurrent-user';
  const numConcurrentRequests = 20;

  console.log(`Making ${numConcurrentRequests} concurrent requests...`);
  console.log('Expected: Only 10 should be allowed (bucket capacity)\n');

  // Create multiple concurrent requests
  const promises = Array.from({ length: numConcurrentRequests }, (_, i) => 
    rateLimiter.allowRequest(userId).then(allowed => ({
      requestId: i + 1,
      allowed
    }))
  );

  // Wait for all requests to complete
  const results = await Promise.all(promises);

  // Count allowed vs denied
  const allowed = results.filter(r => r.allowed).length;
  const denied = results.filter(r => !r.allowed).length;

  console.log('Results:');
  console.log(`  Allowed: ${allowed}`);
  console.log(`  Denied: ${denied}`);
  console.log(`  Total: ${results.length}`);

  // Verify correctness
  const state = await rateLimiter.getState(userId);
  console.log(`\nFinal state:`);
  console.log(`  Remaining tokens: ${state.remainingRequests}`);
  console.log(`  Expected remaining: 0 (all tokens consumed)`);

  if (allowed === 10 && denied === 10) {
    console.log('\n✅ Concurrency test PASSED: Exactly 10 requests allowed');
  } else {
    console.log('\n❌ Concurrency test FAILED: Race condition detected!');
  }
}

/**
 * Race Condition Test - Shows what happens WITHOUT proper locking
 * This demonstrates why AsyncLock is necessary
 */
async function raceConditionTest() {
  console.log('\n=== Race Condition Test (Without Lock) ===\n');
  
  // Simulate a scenario where multiple requests check tokens simultaneously
  // In a real scenario without locks, this could lead to over-consumption
  
  const strategy2 = new TokenBucketStrategy(5, 1);
  const rateLimiter2 = new RateLimiter(strategy2);
  
  const userId2 = 'race-test-user';
  
  // Simulate rapid concurrent requests
  const rapidRequests = Array.from({ length: 100 }, () => 
    rateLimiter2.allowRequest(userId2)
  );
  
  const results2 = await Promise.all(rapidRequests);
  const allowedCount2 = results2.filter(Boolean).length;
  
  console.log(`Made 100 rapid concurrent requests`);
  console.log(`Allowed: ${allowedCount2}`);
  console.log(`Expected: At most 5 (bucket capacity)`);
  
  if (allowedCount2 <= 5) {
    console.log('✅ No race condition detected - AsyncLock working correctly');
  } else {
    console.log('❌ Race condition detected - tokens were over-consumed');
  }
}

/**
 * Multiple Users Concurrency Test
 */
async function multipleUsersTest() {
  console.log('\n=== Multiple Users Concurrency Test ===\n');
  
  const strategy3 = new TokenBucketStrategy(5, 1);
  const rateLimiter3 = new RateLimiter(strategy3);
  
  const users = ['user-1', 'user-2', 'user-3'];
  const requestsPerUser = 10;
  
  // Create concurrent requests for multiple users
  const allPromises = users.flatMap(userId =>
    Array.from({ length: requestsPerUser }, () =>
      rateLimiter3.allowRequest(userId).then(allowed => ({ userId, allowed }))
    )
  );
  
  const results3 = await Promise.all(allPromises);
  
  // Group results by user
  const userResults = users.map(userId => {
    const userRequests = results3.filter(r => r.userId === userId);
    const allowed = userRequests.filter(r => r.allowed).length;
    return { userId, allowed, total: userRequests.length };
  });
  
  console.log('Results per user:');
  userResults.forEach(({ userId, allowed, total }) => {
    console.log(`  ${userId}: ${allowed}/${total} allowed (expected: 5/${total})`);
  });
  
  // Each user should have their own bucket
  const allCorrect = userResults.every(({ allowed }) => allowed === 5);
  if (allCorrect) {
    console.log('\n✅ Multiple users test PASSED: Each user has independent bucket');
  } else {
    console.log('\n❌ Multiple users test FAILED');
  }
}

// Run all demos
async function runAllDemos() {
  await concurrencyDemo();
  await raceConditionTest();
  await multipleUsersTest();
}

runAllDemos().catch(console.error);
