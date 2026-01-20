# Weighted Round Robin - Corrected Explanation

## Initial State

```javascript
constructor() {
  this.currentWeight = 0;    // Starts at 0, NOT max weight!
  this.currentIndex = -1;
}
```

## First Request Flow (Corrected)

Let's trace what actually happens with servers [weight=3, weight=2, weight=1]:

### Initial State:
- `currentWeight` = 0
- `currentIndex` = -1

### Request 1:
```javascript
// Loop iteration
currentIndex = (-1 + 1) % 3 = 0  // First server

// Check if we've completed a cycle (back to index 0)
if (currentIndex === 0) {  // ✅ TRUE (first time hitting 0)
  currentWeight = 0 - 1 = -1
  if (currentWeight <= 0) {  // ✅ TRUE (-1 <= 0)
    currentWeight = Math.max(3, 2, 1) = 3  // Reset to max weight
  }
}

// Check if server qualifies
if (server[0].weight (3) >= currentWeight (3)) {  // ✅ TRUE
  return server[0]  // Select server1
}
```

**Result:** server1 selected, `currentWeight` = 3, `currentIndex` = 0

### Request 2:
```javascript
currentIndex = (0 + 1) % 3 = 1  // Second server
if (currentIndex === 0) {  // ❌ FALSE
  // Skip weight decrement
}

if (server[1].weight (2) >= currentWeight (3)) {  // ❌ FALSE
  // Continue loop
}

currentIndex = (1 + 1) % 3 = 2  // Third server
if (currentIndex === 0) {  // ❌ FALSE
}

if (server[2].weight (1) >= currentWeight (3)) {  // ❌ FALSE
  // Continue loop
}

currentIndex = (2 + 1) % 3 = 0  // Back to first server
if (currentIndex === 0) {  // ✅ TRUE (completed a cycle)
  currentWeight = 3 - 1 = 2  // Decrement weight
  if (currentWeight <= 0) {  // ❌ FALSE (2 > 0)
    // Don't reset
  }
}

if (server[0].weight (3) >= currentWeight (2)) {  // ✅ TRUE
  return server[0]  // Select server1
}
```

**Result:** server1 selected, `currentWeight` = 2, `currentIndex` = 0

### Request 3:
```javascript
currentIndex = (0 + 1) % 3 = 1
if (currentIndex === 0) {  // ❌ FALSE
}

if (server[1].weight (2) >= currentWeight (2)) {  // ✅ TRUE
  return server[1]  // Select server2
}
```

**Result:** server2 selected, `currentWeight` = 2, `currentIndex` = 1

And so on...

## Key Insight

The algorithm **initializes `currentWeight` to 0**, but on the **very first request**, when `currentIndex` becomes 0 for the first time, it triggers the reset logic:

```javascript
if (this.currentIndex === 0) {  // First time hitting index 0
  this.currentWeight = this.currentWeight - 1;  // 0 - 1 = -1
  if (this.currentWeight <= 0) {  // -1 <= 0 is true
    this.currentWeight = Math.max(...weights);  // Reset to max weight
  }
}
```

So effectively, `currentWeight` gets set to the maximum weight on the first request, but it starts at 0.

## Why Start at 0?

Starting at 0 ensures that:
1. The first request triggers the reset logic
2. We can detect when we've completed a full cycle (when currentIndex becomes 0 again)
3. The reset condition (`currentWeight <= 0`) works correctly

## Complete First Cycle Trace

With weights [3, 2, 1]:

| Request | currentIndex | currentWeight | Selected | Reason |
|---------|-------------|---------------|-----------|--------|
| 1 | 0 | 0→3 (reset) | server1 | weight 3 >= 3 |
| 2 | 0 | 3→2 (decr) | server1 | weight 3 >= 2 |
| 3 | 1 | 2 | server2 | weight 2 >= 2 |
| 4 | 0 | 2→1 (decr) | server1 | weight 3 >= 1 |
| 5 | 1 | 1 | server2 | weight 2 >= 1 |
| 6 | 2 | 1 | server3 | weight 1 >= 1 |
| 7 | 0 | 1→0→3 (reset) | server1 | weight 3 >= 3 |

After 6 requests: server1=3, server2=2, server3=1 ✓

## Corrected Code Flow

```javascript
// Initialization
currentWeight = 0
currentIndex = -1

// First request
currentIndex = 0  // First time
if (currentIndex === 0) {
  currentWeight = 0 - 1 = -1
  if (-1 <= 0) {
    currentWeight = max(weights)  // Set to 3
  }
}
// Now currentWeight = 3

// Subsequent requests
// When currentIndex cycles back to 0:
if (currentIndex === 0) {
  currentWeight = currentWeight - 1  // Decrement
  if (currentWeight <= 0) {
    currentWeight = max(weights)  // Reset if needed
  }
}
```

## Summary

- **Initial state:** `currentWeight = 0` (not max weight)
- **First request:** Automatically resets to max weight when `currentIndex` becomes 0
- **Subsequent cycles:** Decrements weight, resets when it reaches 0
- **Result:** Works correctly, but the initialization is 0, not max weight

The algorithm is correct! Starting at 0 is intentional - it ensures the reset logic triggers properly on the first request.

