# 🚀 Quick Example: `await` vs `Promise.all`

## Simple Code Example

```typescript
// Start 3 operations
const op1 = counter.increment();  // Promise 1
const op2 = counter.increment();  // Promise 2
const op3 = counter.increment();  // Promise 3

// ❌ WITHOUT Promise.all - WRONG!
const value = counter.getValue();  // Checks immediately - might be 0, 1, or 2 (wrong!)

// ✅ WITH Promise.all - CORRECT!
await Promise.all([op1, op2, op3]);  // Wait for all 3 to finish
const value = counter.getValue();     // Now checks - will be 3 (correct!)
```

## Timeline Visualization

### Without `Promise.all`:
```
Time 0ms:  Start op1, op2, op3 (all begin working)
Time 1ms:  Check value → "It's 1!" ❌ (only op1 finished)
Time 50ms: op2 finishes
Time 60ms: op3 finishes
          But we already checked at 1ms! Too early!
```

### With `Promise.all`:
```
Time 0ms:  Start op1, op2, op3 (all begin working)
Time 1ms:  Still waiting... (Promise.all waiting)
Time 50ms: op2 finishes, still waiting...
Time 60ms: op3 finishes - ALL DONE!
Time 60ms: Promise.all says "Okay, everyone finished!"
Time 60ms: Check value → "It's 3!" ✅ (correct!)
```

## Why `await` Inside `increment()`?

```typescript
async increment(): Promise<void> {
  await this.delay(10);        // Wait 10ms
  const current = this.value;  // Then read
  await this.delay(10);        // Wait 10ms more
  this.value = current + 1;    // Then write
}
```

**Without `await`:**
- The delays wouldn't actually wait
- Read and write would happen instantly
- Race conditions would be less visible

**With `await`:**
- Each step waits for the previous one
- Delays actually happen
- Race conditions become obvious!

## Summary

| Concept | What It Does | When to Use |
|---------|--------------|-------------|
| `await` | Waits for ONE async operation | Inside functions to wait for steps |
| `Promise.all` | Waits for ALL async operations | When you start multiple operations and need all results |

**Remember:**
- `await` = "Wait for this one thing"
- `Promise.all` = "Wait for everyone"
