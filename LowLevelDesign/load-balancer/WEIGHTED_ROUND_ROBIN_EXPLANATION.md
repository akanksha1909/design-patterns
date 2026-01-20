# Weighted Round Robin Algorithm - Detailed Explanation

## Overview

**Weighted Round Robin (WRR)** is a load balancing algorithm that distributes requests to backend servers based on their assigned weights. Servers with higher weights receive more requests proportionally.

### Key Concept:
- **Weight** = Relative capacity/priority of a server
- Higher weight = More requests
- Distribution is proportional to weights

---

## Algorithm Explanation

### The Algorithm Logic:

The implementation uses a **decrementing weight** approach:

1. **Initialize** `currentWeight` = 0 (not max weight!)
2. On first request, when `currentIndex` becomes 0, reset `currentWeight` to maximum weight
3. Cycle through servers in round-robin fashion
4. For each server, check if its weight >= currentWeight
5. If yes, select that server
6. When completing a full cycle (back to index 0), decrement currentWeight
7. When currentWeight reaches 0 or below, reset it to maximum weight
8. Repeat

### Why This Approach?

This ensures that over time, the distribution matches the weight ratios exactly. For example:
- Server with weight 3 gets 3x more requests than server with weight 1
- Over 4 requests: Server(weight=3) gets 3, Server(weight=1) gets 1

---

## Code Walkthrough

### Class Structure

```javascript
export class WeightedRoundRobin extends LoadBalancingAlgorithm {
  constructor() {
    super('WeightedRoundRobin');
    this.currentWeight = 0;    // Current weight threshold
    this.currentIndex = -1;    // Current position in server array
  }
}
```

**State Variables:**
- `currentWeight`: The weight threshold we're currently checking against
- `currentIndex`: Which server we're currently examining in the array

### Main Selection Method

```javascript
selectServer(servers) {
  // Step 1: Validate input
  if (!servers || servers.length === 0) {
    return null;
  }

  // Step 2: Filter only healthy servers
  const healthyServers = servers.filter(server => server.isHealthy);
  if (healthyServers.length === 0) {
    return null;
  }

  // Step 3: Calculate total weight (for edge case handling)
  const totalWeight = healthyServers.reduce((sum, server) => sum + server.weight, 0);
  if (totalWeight === 0) {
    return healthyServers[0];  // All weights are 0, return first server
  }

  // Step 4: Weighted round robin selection loop
  while (true) {
    // Move to next server (circular)
    this.currentIndex = (this.currentIndex + 1) % healthyServers.length;
    
    // If we've completed a full cycle (back to index 0)
    if (this.currentIndex === 0) {
      // Decrement the weight threshold
      this.currentWeight = this.currentWeight - 1;
      
      // If weight reached 0 or below, reset to maximum weight
      if (this.currentWeight <= 0) {
        this.currentWeight = Math.max(...healthyServers.map(s => s.weight));
      }
    }
    
    // Check if current server's weight is sufficient
    if (healthyServers[this.currentIndex].weight >= this.currentWeight) {
      return healthyServers[this.currentIndex];  // Select this server
    }
    // Otherwise, continue to next server in the loop
  }
}
```

---

## Step-by-Step Example

Let's trace through with 3 servers:

**Server Configuration:**
- server1: weight = 3
- server2: weight = 2
- server3: weight = 1

**Initial State:**
- `currentWeight` = 0  ← Starts at 0, NOT max weight!
- `currentIndex` = -1

### Request 1:
```
currentIndex = (-1 + 1) % 3 = 0  (server1)
currentIndex === 0? Yes  ← First time hitting index 0
  currentWeight = 0 - 1 = -1
  currentWeight <= 0? Yes  ← Triggers reset
    currentWeight = max(3, 2, 1) = 3  ← Reset to max weight

Check: server1.weight (3) >= currentWeight (3)? Yes
→ Select server1
```

**Note:** Even though `currentWeight` starts at 0, the first request automatically resets it to max weight (3) when `currentIndex` becomes 0 for the first time.

**State after Request 1:**
- `currentWeight` = 3
- `currentIndex` = 0

### Request 2:
```
currentIndex = (0 + 1) % 3 = 1  (server2)
currentIndex === 0? No

Check: server2.weight (2) >= currentWeight (3)? No
→ Continue loop

currentIndex = (1 + 1) % 3 = 2  (server3)
currentIndex === 0? No

Check: server3.weight (1) >= currentWeight (3)? No
→ Continue loop

currentIndex = (2 + 1) % 3 = 0  (server1)
currentIndex === 0? Yes
  currentWeight = 3 - 1 = 2

Check: server1.weight (3) >= currentWeight (2)? Yes
→ Select server1
```

**State after Request 2:**
- `currentWeight` = 2
- `currentIndex` = 0

### Request 3:
```
currentIndex = (0 + 1) % 3 = 1  (server2)
currentIndex === 0? No

Check: server2.weight (2) >= currentWeight (2)? Yes
→ Select server2
```

**State after Request 3:**
- `currentWeight` = 2
- `currentIndex` = 1

### Request 4:
```
currentIndex = (1 + 1) % 3 = 2  (server3)
currentIndex === 0? No

Check: server3.weight (1) >= currentWeight (2)? No
→ Continue loop

currentIndex = (2 + 1) % 3 = 0  (server1)
currentIndex === 0? Yes
  currentWeight = 2 - 1 = 1

Check: server1.weight (3) >= currentWeight (1)? Yes
→ Select server1
```

**State after Request 4:**
- `currentWeight` = 1
- `currentIndex` = 0

### Request 5:
```
currentIndex = (0 + 1) % 3 = 1  (server2)
currentIndex === 0? No

Check: server2.weight (2) >= currentWeight (1)? Yes
→ Select server2
```

### Request 6:
```
currentIndex = (1 + 1) % 3 = 2  (server3)
currentIndex === 0? No

Check: server3.weight (1) >= currentWeight (1)? Yes
→ Select server3
```

### Request 7:
```
currentIndex = (2 + 1) % 3 = 0  (server1)
currentIndex === 0? Yes
  currentWeight = 1 - 1 = 0
  currentWeight <= 0? Yes
    currentWeight = max(3, 2, 1) = 3

Check: server1.weight (3) >= currentWeight (3)? Yes
→ Select server1
```

**Cycle Complete!** After 6 requests (3+2+1):
- server1: 3 requests (50%)
- server2: 2 requests (33.3%)
- server3: 1 request (16.7%)

---

## Visual Representation

### Request Distribution Pattern

With weights [3, 2, 1]:

```
Request:  1  2  3  4  5  6  7  8  9  10 11 12
Server:   1  1  2  1  2  3  1  1  2  1  2  3
          ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑
          └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘
          Cycle 1 (6 requests)    Cycle 2 (6 requests)

Distribution per cycle:
- server1 (weight 3): 3 requests
- server2 (weight 2): 2 requests  
- server3 (weight 1): 1 request
```

### Weight Decrement Visualization

```
Cycle Start: currentWeight = 3

Request 1: Check server1 (weight=3) >= 3? ✓ Select → currentWeight stays 3
Request 2: Check server2 (weight=2) >= 3? ✗ Skip
            Check server3 (weight=1) >= 3? ✗ Skip
            Check server1 (weight=3) >= 2? ✓ Select → currentWeight = 2
Request 3: Check server2 (weight=2) >= 2? ✓ Select → currentWeight stays 2
Request 4: Check server3 (weight=1) >= 2? ✗ Skip
            Check server1 (weight=3) >= 1? ✓ Select → currentWeight = 1
Request 5: Check server2 (weight=2) >= 1? ✓ Select → currentWeight stays 1
Request 6: Check server3 (weight=1) >= 1? ✓ Select → currentWeight = 0

Reset: currentWeight = 3 (max weight)
```

---

## Key Code Sections Explained

### 1. Edge Case: All Weights Zero

```javascript
const totalWeight = healthyServers.reduce((sum, server) => sum + server.weight, 0);
if (totalWeight === 0) {
  return healthyServers[0];
}
```

**Why?** If all servers have weight 0, we can't do weighted selection. Fallback to first server.

### 2. Circular Indexing

```javascript
this.currentIndex = (this.currentIndex + 1) % healthyServers.length;
```

**Why?** Ensures we cycle through servers: 0 → 1 → 2 → 0 → 1 → ...

### 3. Weight Reset Logic

```javascript
if (this.currentIndex === 0) {
  this.currentWeight = this.currentWeight - 1;
  if (this.currentWeight <= 0) {
    this.currentWeight = Math.max(...healthyServers.map(s => s.weight));
  }
}
```

**Why?** 
- When we complete a full cycle (back to index 0), decrement weight
- When weight reaches 0, we've completed a full weighted cycle
- Reset to maximum weight to start new cycle

### 4. Selection Condition

```javascript
if (healthyServers[this.currentIndex].weight >= this.currentWeight) {
  return healthyServers[this.currentIndex];
}
```

**Why?** Only select servers whose weight is sufficient for current threshold. This ensures proportional distribution.

---

## Mathematical Verification

For weights [3, 2, 1]:

**Total Weight:** 3 + 2 + 1 = 6

**Expected Distribution:**
- server1: 3/6 = 50% of requests
- server2: 2/6 = 33.3% of requests
- server3: 1/6 = 16.7% of requests

**Per Cycle (6 requests):**
- server1: 3 requests ✓
- server2: 2 requests ✓
- server3: 1 request ✓

**Over 12 requests (2 cycles):**
- server1: 6 requests (50%) ✓
- server2: 4 requests (33.3%) ✓
- server3: 2 requests (16.7%) ✓

---

## Reset Method

```javascript
reset() {
  this.currentWeight = 0;
  this.currentIndex = -1;
}
```

**Purpose:** Reset algorithm state to initial values. Useful for testing or when server pool changes significantly.

---

## Advantages

1. **Proportional Distribution**: Exactly matches weight ratios
2. **Fair**: All servers get requests, just in different proportions
3. **Predictable**: Distribution is deterministic and repeatable
4. **Efficient**: O(n) worst case, but typically much faster
5. **Handles Dynamic Weights**: Can change server weights at runtime

---

## Use Cases

1. **Different Server Capacities:**
   - Powerful server: weight = 3
   - Standard servers: weight = 1

2. **Cost Optimization:**
   - Expensive high-performance: weight = 2
   - Cheaper servers: weight = 1

3. **Geographic Distribution:**
   - Primary data center: weight = 3
   - Secondary data center: weight = 1

4. **Gradual Rollout:**
   - New server: weight = 1 (10% traffic)
   - Old servers: weight = 9 (90% traffic)

---

## Comparison with Other Algorithms

| Algorithm | Distribution | Considers Weight? | State Required |
|-----------|-------------|-------------------|----------------|
| **Round Robin** | Equal (1:1:1) | ❌ No | currentIndex |
| **Weighted Round Robin** | Proportional (3:2:1) | ✅ Yes | currentWeight, currentIndex |
| **Least Connections** | Based on load | ❌ No | None (uses server state) |
| **Random** | Probabilistic | ❌ No | None |

---

## Code Complexity

- **Time Complexity:** O(n) worst case, O(1) average
  - Worst case: All servers have weight 1, need to check all
  - Average: Finds server quickly
  
- **Space Complexity:** O(1)
  - Only stores currentWeight and currentIndex

---

## Testing the Algorithm

```javascript
// Example: Test with weights [3, 2, 1]
const servers = [
  { id: 's1', weight: 3, isHealthy: true },
  { id: 's2', weight: 2, isHealthy: true },
  { id: 's3', weight: 1, isHealthy: true }
];

const algorithm = new WeightedRoundRobin();

// Make 6 requests (one full cycle)
for (let i = 0; i < 6; i++) {
  const selected = algorithm.selectServer(servers);
  console.log(`Request ${i+1}: ${selected.id}`);
}

// Expected output:
// Request 1: s1
// Request 2: s1
// Request 3: s2
// Request 4: s1
// Request 5: s2
// Request 6: s3
```

---

## Summary

The Weighted Round Robin algorithm ensures that servers receive requests proportional to their weights. The implementation uses a decrementing weight threshold that cycles through servers, selecting those with sufficient weight. This guarantees fair, predictable, and proportional distribution over time.

