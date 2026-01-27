# Concurrency Issues in Parking Lot Application

## Critical Issues

### 1. Race Condition in `parkVehicle()` - Double Booking
**Location**: `ParkingLotManager._findAvailableSpot()` (lines 47-61)

**Problem**: 
```typescript
// Thread 1 checks availability
if (!this._occupiedSpotIds.has(key)) {
    // Thread 2 also checks here and sees the same spot available
    availableSlot = value;
    break;
}
// Both threads proceed to mark the spot as occupied
this._occupiedSpotIds.add(availableSlot.getId())
```

**Impact**: Two vehicles can be assigned the same parking spot simultaneously.

**Scenario**:
- Thread A checks spot X is available → finds it free
- Thread B checks spot X is available → also finds it free (before A marks it)
- Both threads mark spot X as occupied
- Both vehicles park in the same spot

---

### 2. Race Condition in Singleton Initialization
**Location**: `ParkingLotManager.getInstance()` (lines 17-22)

**Problem**:
```typescript
public static getInstance() {
    if (this._instance == null) {  // Thread 1 checks
        // Thread 2 also checks here and sees null
        this._instance = new ParkingLotManager();  // Both create instances
    }
    return this._instance;
}
```

**Impact**: Multiple instances of `ParkingLotManager` can be created, leading to inconsistent state across different instances.

---

### 3. Race Condition in `unParkVehicle()` - Double Unparking
**Location**: `ParkingLotManager.unParkVehicle()` (lines 32-45)

**Problem**:
```typescript
if(!this._activeTickets.has(ticketId)) {  // Thread 1 checks
    return;
}
// Thread 2 also checks here and sees ticket exists
let ticket = this._activeTickets.get(ticketId)
// Both threads proceed to unpark
this._occupiedSpotIds.delete(ticket.getParkingSpot().getId())
this._activeTickets.delete(ticketId)
```

**Impact**: 
- Same ticket can be processed twice
- Fee calculated twice
- Spot freed twice (though idempotent, still incorrect)

---

### 4. Lost Updates on Shared Collections
**Location**: Throughout `ParkingLotManager`

**Problem**: 
- `Map` and `Set` operations in JavaScript/TypeScript are not thread-safe
- Concurrent modifications to `_parkingSpots`, `_activeTickets`, `_occupiedSpotIds` can cause:
  - Lost updates
  - Inconsistent state
  - Data corruption

**Example**:
```typescript
// Thread 1: Adding ticket
this._activeTickets.set(ticket.getId(), ticket);

// Thread 2: Iterating tickets (could see inconsistent state)
for (let [key, value] of this._activeTickets.entries()) {
    // May miss tickets being added concurrently
}
```

---

### 5. Inconsistent State on Partial Failures
**Location**: `parkVehicle()` and `unParkVehicle()`

**Problem**: Operations are not atomic. If a thread fails mid-operation:

**In `parkVehicle()`**:
```typescript
const ticket = new Ticket(availableSpot, Date.now());
this._activeTickets.set(ticket.getId(), ticket);  // If this fails, spot is marked occupied but no ticket exists
```

**In `unParkVehicle()`**:
```typescript
this._occupiedSpotIds.delete(ticket.getParkingSpot().getId())  // If this fails, ticket deleted but spot still marked occupied
this._activeTickets.delete(ticketId)
```

**Impact**: System state becomes inconsistent (spots marked occupied but no tickets, or tickets exist but spots not marked).

---

### 6. Non-Atomic Check-Then-Act Operations
**Location**: Multiple locations

**Problem**: All check-then-act operations lack atomicity:
- Check if spot available → Mark as occupied
- Check if ticket exists → Delete ticket
- Check if instance exists → Create instance

**Impact**: Race conditions can occur at any of these boundaries.

---

## Recommended Solutions

### 1. Use Per-Spot Locking (✅ IMPLEMENTED)
**Best approach**: Use fine-grained locking with a mutex per parking spot.

**Why per-spot locking?**
- ✅ Maximum concurrency - multiple vehicles can park in different spots simultaneously
- ✅ Better performance - only serializes access to the same spot
- ✅ Scalable - performance improves with more spots

**Implementation**: See `src/ParkingLotManager.ts` - uses `Mutex` per spot with try-lock pattern.

**Alternative: Single Global Lock**
```typescript
private _lock = new Mutex();

async parkVehicle(vehicleType: VehicleType): Promise<Ticket> {
    await this._lock.acquire();
    try {
        const availableSpot = this._findAvailableSpot(vehicleType);
        const ticket = new Ticket(availableSpot, Date.now());
        this._activeTickets.set(ticket.getId(), ticket);
        return ticket;
    } finally {
        this._lock.release();
    }
}
```
*Note: This is simpler but provides poor concurrency - all operations are serialized.*

### 2. Use Atomic Operations
Use atomic data structures or operations:
- Consider using `Map` with atomic operations
- Use database transactions if using a database
- Use Redis with atomic operations for distributed systems

### 3. Fix Singleton Pattern
Use double-checked locking or eager initialization:
```typescript
private static _instance: ParkingLotManager = new ParkingLotManager();

public static getInstance(): ParkingLotManager {
    return this._instance;
}
```

### 4. Make Operations Atomic
Group related operations into atomic transactions:
```typescript
private _parkVehicleAtomically(vehicleType: VehicleType): Ticket {
    // All-or-nothing operation
    const availableSpot = this._findAvailableSpot(vehicleType);
    if (!availableSpot) throw new Error("No spots available");
    
    const ticket = new Ticket(availableSpot, Date.now());
    this._occupiedSpotIds.add(availableSpot.getId());
    this._activeTickets.set(ticket.getId(), ticket);
    
    return ticket;
}
```

### 5. Use Database with Transactions
For production systems, use a database with ACID transactions:
- Begin transaction
- Check availability
- Create ticket
- Mark spot occupied
- Commit transaction

### 6. Use Worker Threads with Message Passing
If using Node.js worker threads, use message passing instead of shared memory.

---

## Testing Concurrency Issues

To test these issues, create concurrent test scenarios:
```typescript
// Simulate 100 concurrent park operations
const promises = Array(100).fill(null).map(() => 
    parkingLotManager.parkVehicle(VehicleType.CAR)
);
const tickets = await Promise.all(promises);
// Check for duplicate spot assignments
```

---

## Priority

1. **Critical**: Fix race condition in `parkVehicle()` - can cause double booking
2. **Critical**: Fix singleton initialization - breaks singleton pattern
3. **High**: Fix race condition in `unParkVehicle()` - can cause double charging
4. **Medium**: Add synchronization for shared collections
5. **Medium**: Make operations atomic to prevent inconsistent state
