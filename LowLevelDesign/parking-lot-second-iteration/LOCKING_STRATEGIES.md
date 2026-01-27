# Locking Strategies for Parking Lot

## Comparison: Coarse-grained vs Fine-grained Locking

### Option 1: Single Lock (Coarse-grained)
**Pros:**
- Simple to implement
- No deadlock risk
- Easy to reason about

**Cons:**
- **Poor concurrency** - Only one vehicle can park/unpark at a time
- **Bottleneck** - All operations serialized
- **Poor scalability** - Performance degrades with concurrent requests

**Example:**
```typescript
private _globalLock = new Mutex();

async parkVehicle(vehicleType: VehicleType): Promise<Ticket> {
    await this._globalLock.acquire();
    try {
        // Only one thread can execute this at a time
        const availableSpot = this._findAvailableSpot(vehicleType);
        // ...
    } finally {
        this._globalLock.release();
    }
}
```

---

### Option 2: Per-Spot Locking (Fine-grained) ✅ **RECOMMENDED**
**Pros:**
- **Better concurrency** - Multiple vehicles can park in different spots simultaneously
- **Better performance** - Only serializes access to the same spot
- **Scalable** - Performance improves with more spots

**Cons:**
- More complex implementation
- Need to handle deadlocks (though unlikely with proper ordering)
- Need lock manager

**Example:**
```typescript
private _spotLocks: Map<string, Mutex> = new Map();

async parkVehicle(vehicleType: VehicleType): Promise<Ticket> {
    // Try to find and lock an available spot
    for (let spot of this._getSpotsByType(vehicleType)) {
        const lock = this._getLockForSpot(spot.getId());
        if (await lock.tryAcquire()) {
            try {
                if (!this._occupiedSpotIds.has(spot.getId())) {
                    // Successfully reserved this spot
                    this._occupiedSpotIds.add(spot.getId());
                    const ticket = new Ticket(spot, Date.now());
                    this._activeTickets.set(ticket.getId(), ticket);
                    return ticket;
                }
            } finally {
                lock.release();
            }
        }
    }
    throw new Error("No spots available");
}
```

---

## Why Per-Spot Locking is Better

### Scenario: 100 concurrent parking requests

**With Single Lock:**
- All 100 requests queue up
- Processed one by one
- Total time: 100 × average_park_time

**With Per-Spot Locking:**
- All 100 requests can check different spots simultaneously
- Only conflicts when multiple vehicles want the same spot
- Total time: ~max(conflicts) × average_park_time
- Much faster!

---

## Implementation Considerations

### 1. Lock Acquisition Strategy

**Option A: Try-Lock Pattern (Recommended)**
- Try to acquire lock on each spot as we check it
- If lock acquired and spot available → reserve it
- If lock acquired but spot occupied → release lock and continue
- If lock unavailable → skip to next spot

**Option B: Lock-Then-Check Pattern**
- Acquire lock first, then check availability
- Simpler but may hold locks longer than needed

### 2. Deadlock Prevention

**Risk:** Very low with per-spot locking because:
- We only hold one lock at a time
- Locks are released immediately after checking
- No circular dependencies

**If you need multiple locks:**
- Always acquire locks in consistent order (e.g., sort by spot ID)
- Use timeout on lock acquisition
- Consider lock ordering

### 3. Lock Manager

Need a way to get/create locks for spots:
```typescript
private _getLockForSpot(spotId: string): Mutex {
    if (!this._spotLocks.has(spotId)) {
        this._spotLocks.set(spotId, new Mutex());
    }
    return this._spotLocks.get(spotId)!;
}
```

### 4. Unparking with Per-Spot Locks

```typescript
async unParkVehicle(ticketId: string): Promise<number> {
    const ticket = this._activeTickets.get(ticketId);
    if (!ticket) {
        throw new Error("Ticket not found");
    }
    
    const spotId = ticket.getParkingSpot().getId();
    const lock = this._getLockForSpot(spotId);
    
    await lock.acquire();
    try {
        // Double-check ticket still exists (could have been deleted)
        if (!this._activeTickets.has(ticketId)) {
            return 0;
        }
        
        const fee = new HourlyFeeStrategy().calculateFee(ticket, Date.now());
        this._occupiedSpotIds.delete(spotId);
        this._activeTickets.delete(ticketId);
        return fee;
    } finally {
        lock.release();
    }
}
```

---

## Hybrid Approach: Lock by Vehicle Type

If you have many spots and want even better performance, you could lock by vehicle type:

```typescript
private _typeLocks: Map<VehicleType, Mutex> = new Map();

// Lock only spots of the same vehicle type
// Still allows concurrent parking of different vehicle types
```

**Trade-off:** Less granular than per-spot, but simpler than per-spot and better than global lock.

---

## Recommendation

**Use Per-Spot Locking** because:
1. ✅ Maximum concurrency
2. ✅ Best performance for high-traffic scenarios
3. ✅ Realistic for production systems
4. ✅ Complexity is manageable

**Implementation Priority:**
1. Implement per-spot locking for `parkVehicle()`
2. Implement per-spot locking for `unParkVehicle()`
3. Add lock manager utility
4. Add timeout handling for lock acquisition
5. Consider adding metrics to monitor lock contention
