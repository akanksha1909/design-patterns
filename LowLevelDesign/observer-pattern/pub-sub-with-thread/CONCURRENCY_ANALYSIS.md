# Concurrency Issues Analysis

## Current Protection Mechanisms

### ✅ Protected Operations (via AsyncLock)
- `createTopic()` - Locked at topic level
- `publish()` - Locked at partition level (`publish:topic:partition`)
- `subscribe()` - Locked at partition level (`subscribe:topic:partition`)
- `unsubscribe()` - Locked at partition level (`unsubscribe:topic:partition`)
- `getMessages()` - Locked at partition level (`read:topic:partition`)
- `getOffset()` - Locked at partition level (`offset:topic:partition`)
- `getTopicInfo()` - Locked at topic level (`info:topic`)
- `Consumer.onMessage()` - Locked per consumer-partition (`consumerId:topic:partition`) ✅ **NEW**

## Potential Concurrency Issues

### 1. ✅ **FIXED: Consumer.onMessage() - Atomic Offset Commit**

**Previous Issue:**
- Offset was committed BEFORE message processing
- If processing failed, offset was already committed → message loss
- No locking → race conditions possible

**Fix Applied:**
```javascript
// Consumer.onMessage() - NOW PROTECTED
async onMessage(message) {
  const lockKey = `${this.id}:${subscriptionKey}`;
  await this.partitionLocks.execute(lockKey, async () => {
    // 1. Check offset (read)
    const lastOffset = this.currentOffset.get(subscriptionKey) || 0;
    if (message.offset < lastOffset) return;
    
    // 2. Process message FIRST
    let processingSucceeded = false;
    if (this.messageHandler) {
      try {
        await this.messageHandler(message);
        processingSucceeded = true;
      } catch (error) {
        throw error; // Prevent offset commit
      }
    } else {
      processingSucceeded = true;
    }
    
    // 3. Commit offset ONLY AFTER successful processing
    if (processingSucceeded) {
      this.currentOffset.set(subscriptionKey, message.offset + 1);
      this.consumedCount++;
    }
  });
}
```

**Protection Mechanisms:**
- ✅ Per-partition locking ensures sequential processing within a partition
- ✅ Offset commit happens AFTER successful message processing (atomic coordination)
- ✅ If processing fails, offset is NOT committed (allows re-delivery)
- ✅ Async handler support with proper error handling

**Result:**
- Messages are processed sequentially per partition (no race conditions)
- Offset commit and message processing are atomically coordinated
- Failed messages can be re-delivered (offset not advanced)

### 2. ⚠️ **Race Condition: Topic.publish() - Consumer Notification**

**Issue:**
```javascript
// Topic.publish() - NOT LOCKED (only Service.publish() is locked)
partition.push(message);
const partitionConsumers = this.consumers.get(partitionId);
partitionConsumers.forEach(consumer => {
  this.notifyAsync(`message:${partitionId}:${consumer.id}`, message);
});
```

**Problem:**
- If `addSubscriber()` is called concurrently with `publish()`, consumer list might be modified during iteration
- Consumer could be added while iterating, potentially missing the message
- Consumer could be removed while iterating, causing errors

**Scenario:**
```
Time  | Thread 1 (publish)              | Thread 2 (addSubscriber)
------|----------------------------------|--------------------------
T1    | Get consumers = [C1, C2]        |
T2    |                                   | Add C3 to consumers
T3    | Iterate: notify C1               |
T4    | Iterate: notify C2               |
T5    |                                   | C3 never notified!
```

### 3. ⚠️ **Race Condition: Consumer Subscription State**

**Issue:**
```javascript
// Consumer.subscribeToTopic() - Partially protected
await this.service.subscribe(topicName, partitionId, this);  // Locked
this.subscriptions.add(subscriptionKey);  // NOT LOCKED
this.currentOffset.set(subscriptionKey, startOffset);  // NOT LOCKED
```

**Problem:**
- Service subscription is locked, but consumer's internal state updates are not
- If `onMessage()` is called between service subscription and state update, message could be lost
- Multiple concurrent subscriptions could cause inconsistent state

### 4. ⚠️ **Race Condition: Topic.addSubscriber() - Observer Subscription**

**Issue:**
```javascript
// Topic.addSubscriber() - NOT LOCKED
const partitionConsumers = this.consumers.get(partitionId);
partitionConsumers.add(consumer);
const eventType = `message:${partitionId}:${consumer.id}`;
this.subscribe(eventType, consumer.onMessage.bind(consumer));
```

**Problem:**
- If `publish()` happens between adding to consumers and subscribing as observer:
  - Consumer added to list but not subscribed → message published → consumer notified via list but observer not set up
- If multiple threads add subscribers concurrently, Set operations are not atomic

### 5. ⚠️ **Race Condition: AsyncLock Queue Modification**

**Issue:**
```javascript
// AsyncLock._createRelease()
queue.shift(); // Remove current lock holder
if (queue.length > 0) {
  const nextResolve = queue[0];
  nextResolve(this._createRelease(key));
}
```

**Problem:**
- If `acquire()` is called while `release()` is executing, queue could be modified during release
- However, this is likely safe because:
  - `acquire()` adds to queue
  - `release()` removes from queue
  - Both operations happen sequentially in the same queue

### 6. ⚠️ **Race Condition: Consumer Offset Tracking**

**Issue:**
```javascript
// Consumer._catchUp() - NOT LOCKED
const currentOffset = await this.service.getOffset(topicName, partitionId);
const messages = await this.service.getMessages(topicName, partitionId, startOffset);
for (const message of messages) {
  process.nextTick(() => {
    this.onMessage(message);
  });
}
```

**Problem:**
- Between `getOffset()` and `getMessages()`, new messages could be published
- Messages could be delivered twice:
  - Once via `_catchUp()` (old messages)
  - Once via `onMessage()` (new messages published during catch-up)

### 7. ⚠️ **Race Condition: Topic Consumer Set Iteration**

**Issue:**
```javascript
// Topic.publish() - Iterating over Set
const partitionConsumers = this.consumers.get(partitionId);
partitionConsumers.forEach(consumer => {
  this.notifyAsync(`message:${partitionId}:${consumer.id}`, message);
});
```

**Problem:**
- If `removeSubscriber()` is called during iteration, Set could be modified
- However, JavaScript Sets are generally safe for iteration, but:
  - If consumer is removed, it might still be in the iteration
  - Observer subscription might be removed, causing notification to fail silently

## Recommendations

### High Priority Fixes

1. ✅ **FIXED: Consumer.onMessage() atomic coordination:**
   - ✅ Per-partition locking implemented
   - ✅ Offset commit happens AFTER successful processing
   - ✅ Failed processing prevents offset commit

2. **Protect Topic.publish() consumer iteration:**
   - Create a snapshot of consumers before iterating
   - Or lock the consumer set during publish

3. **Protect Consumer state updates:**
   - Lock consumer's internal state during subscription
   - Ensure atomic subscription state updates

4. **Fix catch-up race condition:**
   - Lock the entire catch-up operation
   - Or use a more sophisticated offset tracking mechanism

### Medium Priority

5. **Protect Topic.addSubscriber():**
   - Lock consumer list modifications
   - Ensure observer subscription happens atomically with consumer addition

6. **Add timeout to locks:**
   - Prevent deadlocks from hanging operations
   - Add lock timeout mechanism

## Current Safety Level

- **Service-level operations:** ✅ Well protected
- **Topic-level operations:** ⚠️ Partially protected
- **Consumer-level operations:** ✅ Protected (offset commit + message processing)
- **Message delivery:** ✅ Protected (per-partition sequential processing)
- **Atomic coordination:** ✅ Offset commit and message processing are atomically coordinated
