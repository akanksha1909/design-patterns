# In-Memory Message Streaming Service

A production-ready MVP for an in-memory message streaming service built in Node.js. This service supports multiple topics, producers, and consumers with guaranteed message ordering within partitions, thread safety, and real-time data streaming.

## Features

✅ **Multiple Topics**: Create and manage multiple message topics  
✅ **Partitioning**: Each topic can have multiple partitions for scalability  
✅ **Message Ordering**: Messages maintain strict ordering within partitions  
✅ **Thread Safety**: AsyncLock ensures thread-safe concurrent operations  
✅ **Real-time Streaming**: Observer Pattern implementation for instant message delivery  
✅ **Multiple Producers**: Support for concurrent message producers  
✅ **Multiple Consumers**: Support for multiple consumers per partition  
✅ **Consumer Groups**: Track offsets per consumer group  
✅ **Offset Management**: Manual offset seeking and tracking  

## Architecture

### Core Components

1. **MessageStreamService**: Central service managing topics, partitions, and message routing
2. **Topic**: Encapsulates topic state including partitions, messages, and consumer subscriptions
3. **Producer**: Publishes messages to topics and partitions
4. **Consumer**: Subscribes to topics/partitions and receives messages in real-time
5. **Observable**: Custom Observer Pattern implementation for event notifications
6. **AsyncLock**: Provides mutex-like behavior for thread-safe operations

### Key Design Decisions

- **In-Memory Storage**: Messages are stored in arrays within partitions for fast access
- **Topic Class**: Encapsulates topic state (partitions, messages, consumers) for better OOP design
- **Observer Pattern**: Custom Observable implementation for real-time message delivery (not EventEmitter)
- **Async Locks**: Custom AsyncLock implementation ensures thread safety without blocking
- **Offset-Based**: Each message has an offset within its partition for ordering
- **Partition-Level Locking**: Locks are scoped to partitions for better concurrency

### Message Ordering Guarantees

The service ensures **strict message ordering within partitions** through multiple mechanisms:

1. **Publishing Order**:
   - `MessageStreamService.publish()` uses partition-level locking (`publish:topic:partition`)
   - Only one publish operation can execute at a time per partition
   - Messages are appended to partition arrays sequentially with monotonically increasing offsets

2. **Storage Order**:
   - Messages are stored in arrays (`partition.push(message)`) in the order they're published
   - Offset is assigned as `partition.length`, ensuring sequential offsets

3. **Delivery Order** (Consumer-side):
   - **Per-partition message queue**: Each consumer maintains a queue (`Map<offset, message>`) per partition
   - **Ordered processing**: Messages are queued as they arrive and processed strictly in offset order
   - **Out-of-order handling**: If message with offset N+1 arrives before offset N, it's queued and waits
   - **Sequential processing**: Per-partition lock ensures only one message is processed at a time
   - Messages are only processed when the next expected offset is available

4. **Atomic Coordination**:
   - Offset commit happens **AFTER** successful message processing
   - If processing fails, offset is not committed, allowing re-delivery
   - Per-partition locking prevents race conditions during offset updates

**Example**: Even if messages arrive as [offset 5, offset 3, offset 4], they will be processed as [3, 4, 5] because the consumer waits for the next expected offset before processing.

## Installation

```bash
npm install
```

## Usage

### Basic Example

```javascript
const { MessageStreamService, Producer, Consumer } = require('./src');

// Initialize service
const service = new MessageStreamService();

// Create a topic with 3 partitions
await service.createTopic('orders', 3);

// Create a producer
const producer = new Producer(service, 'producer-1');

// Create a consumer
const consumer = new Consumer(service, 'consumer-1', 'group-1');

// Subscribe consumer to partition 0
await consumer.subscribe('orders', 0);

// Set up message handler using Observer Pattern
consumer.subscribe('message', (msg) => {
  console.log('Received:', msg.data);
});

// Publish a message
await producer.send('orders', 0, { orderId: '123', amount: 100 });
```

### Running the Example

```bash
npm start
```

## API Reference

### MessageStreamService

#### `createTopic(topicName, numPartitions)`
Creates a new topic with specified number of partitions.

```javascript
await service.createTopic('orders', 3);
```

#### `publish(topicName, partitionId, message)`
Publishes a message to a specific topic and partition. Returns the offset.

```javascript
const offset = await service.publish('orders', 0, { orderId: '123' });
```

#### `subscribe(topicName, partitionId, consumer)`
Subscribes a consumer to a topic and partition.

#### `getMessages(topicName, partitionId, offset, limit)`
Retrieves messages from a partition starting from a specific offset.

```javascript
const messages = await service.getMessages('orders', 0, 0, 10);
```

#### `getOffset(topicName, partitionId)`
Gets the current offset (number of messages) in a partition.

#### `getTopicInfo(topicName)`
Gets information about a topic including partition counts and consumer counts.

### Producer

#### `send(topicName, partitionId, message)`
Publishes a single message to a topic and partition.

```javascript
await producer.send('orders', 0, { orderId: '123', amount: 100 });
```

#### `sendBatch(topicName, messages, partitionSelector)`
Publishes multiple messages. Supports custom partition selection.

```javascript
const messages = [
  { orderId: '1', amount: 100 },
  { orderId: '2', amount: 200 }
];
await producer.sendBatch('orders', messages);
```

#### `getStats()`
Returns producer statistics (ID, published count).

### Consumer

#### `subscribe(topicName, partitionId, startOffset)`
Subscribes to a topic and partition. Starts consuming from `startOffset` (default: 0).

```javascript
await consumer.subscribe('orders', 0, 0);
```

#### `unsubscribe(topicName, partitionId)`
Unsubscribes from a topic and partition.

#### `unsubscribeAll()`
Unsubscribes from all subscriptions.

#### `seek(topicName, partitionId, offset)`
Seeks to a specific offset in a partition.

```javascript
await consumer.seek('orders', 0, 5);
```

#### `getOffset(topicName, partitionId)`
Gets the current offset for a subscription.

#### `getStats()`
Returns consumer statistics (ID, group, consumed count, subscriptions, offsets).

### Observer Pattern Events

All components extend the `Observable` class and use the Observer Pattern for notifications.

#### Consumer Events
Subscribe to events using `consumer.subscribe(eventType, observer)`:
- `message`: Notified when a new message is received
- `subscribed`: Notified when subscription is successful
- `unsubscribed`: Notified when unsubscription is successful
- `seeked`: Notified when seek operation completes

#### Producer Events
Subscribe to events using `producer.subscribe(eventType, observer)`:
- `message:sent`: Notified when a message is successfully sent
- `error`: Notified when an error occurs

#### Service Events
Subscribe to events using `service.subscribe(eventType, observer)`:
- `topic:created`: Notified when a topic is created
- `message:published`: Notified when a message is published
- `consumer:subscribed`: Notified when a consumer subscribes
- `consumer:unsubscribed`: Notified when a consumer unsubscribes

**Note**: The `subscribe()` method returns an unsubscribe function for easy cleanup:
```javascript
const unsubscribe = consumer.subscribe('message', (msg) => {
  console.log('Received:', msg);
});
// Later...
unsubscribe();
```

## Thread Safety

The service uses a custom `AsyncLock` implementation to ensure thread safety:

- **Partition-Level Locking**: Each partition has its own lock, allowing concurrent operations on different partitions
- **Non-Blocking**: Uses promise-based queuing instead of blocking operations
- **Atomic Operations**: All critical operations (publish, subscribe, read) are atomic

## Message Ordering

Messages are guaranteed to maintain order within partitions:

- Each message has a sequential offset within its partition
- Messages are appended to partitions in order
- Consumers receive messages in offset order
- Partition-level locking ensures no race conditions

## Real-Time Streaming

The service provides real-time message delivery using the Observer Pattern:

- Custom `Observable` class implements the Observer Pattern (Subject-Observer)
- Messages are delivered immediately after publishing
- Consumers receive messages via observer callbacks
- Supports catch-up for messages published before subscription
- Thread-safe observer notifications

## Limitations

This is an MVP implementation with the following limitations:

- **In-Memory Only**: Messages are not persisted to disk
- **Single Process**: Designed for single Node.js process
- **No Replication**: No backup or replication of messages
- **No Retention Policy**: Messages are never deleted
- **No Authentication**: No security or access control

## Future Enhancements

Potential improvements for production use:

- Persistent storage (file system or database)
- Message retention policies
- Consumer group coordination
- Replication and fault tolerance
- Authentication and authorization
- Metrics and monitoring
- Compression and serialization
- Dead letter queues

## Interview Points

This implementation demonstrates:

1. **Design Patterns**: 
   - **Observer Pattern**: Custom Observable implementation (not EventEmitter)
   - **Producer-Consumer Pattern**: Decoupled message production and consumption
2. **Concurrency**: Thread-safe operations with async locks
3. **Data Structures**: Efficient use of Maps and Sets
4. **Observer Pattern**: Real-time message delivery via Subject-Observer relationship
5. **API Design**: Clean, intuitive API surface with method overloading
6. **Error Handling**: Proper error propagation in observers
7. **Scalability**: Partition-based design for horizontal scaling

## License

MIT
