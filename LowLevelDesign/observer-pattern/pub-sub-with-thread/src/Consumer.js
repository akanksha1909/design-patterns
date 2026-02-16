const AsyncLock = require('./utils/AsyncLock');

/**
 * Consumer - Consumes messages from topics and partitions
 * Supports real-time message streaming via callback
 * Ensures atomic coordination between offset commit and message processing
 */
class Consumer {
  /**
   * @param {MessageStreamService} service - The message streaming service instance
   * @param {string} consumerId - Unique identifier for this consumer
   * @param {string} consumerGroupId - Consumer group ID (for offset tracking)
   */
  constructor(service, consumerId, consumerGroupId = 'default') {
    this.service = service;
    this.id = consumerId || `consumer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.consumerGroupId = consumerGroupId;
    this.subscriptions = new Set(); // Set of "topic:partition" strings
    this.consumedCount = 0;
    this.currentOffset = new Map(); // Map<"topic:partition", offset>
    this.messageHandler = null; // Single callback for message handling
    // Per-partition lock ensures sequential processing and atomic offset commits
    this.partitionLocks = new AsyncLock();
    // Per-partition message queues: Map<"topic:partition", Map<offset, message>>
    // Messages are queued and processed in offset order
    this.messageQueues = new Map();
  }

  /**
   * Subscribes to a topic and partition
   * This method delegates to the Topic class which manages consumer subscriptions
   * @param {string} topicName - Name of the topic
   * @param {number} partitionId - Partition ID
   * @param {number} startOffset - Offset to start consuming from (default: 0)
   */
  async subscribeToTopic(topicName, partitionId, startOffset = 0) {
    const subscriptionKey = `${topicName}:${partitionId}`;
    
    if (this.subscriptions.has(subscriptionKey)) {
      throw new Error(`Already subscribed to ${subscriptionKey}`);
    }

    // Subscribe through service (which delegates to Topic)
    await this.service.subscribe(topicName, partitionId, this);
    this.subscriptions.add(subscriptionKey);
    this.currentOffset.set(subscriptionKey, startOffset);

    // Consume any existing messages from the start offset
    await this._catchUp(topicName, partitionId, startOffset);
  }

  /**
   * Sets the message handler callback
   * @param {Function} handler - Callback function that receives messages
   */
  setMessageHandler(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Message handler must be a function');
    }
    this.messageHandler = handler;
  }

  /**
   * Unsubscribes from a topic and partition
   * @param {string} topicName - Name of the topic
   * @param {number} partitionId - Partition ID
   */
  async unsubscribe(topicName, partitionId) {
    const subscriptionKey = `${topicName}:${partitionId}`;
    
    if (!this.subscriptions.has(subscriptionKey)) {
      return;
    }

    await this.service.unsubscribe(topicName, partitionId, this);
    this.subscriptions.delete(subscriptionKey);
    this.currentOffset.delete(subscriptionKey);
    this.messageQueues.delete(subscriptionKey);
  }

  /**
   * Unsubscribes from all topics and partitions
   */
  async unsubscribeAll() {
    const subscriptions = Array.from(this.subscriptions);
    
    for (const subscriptionKey of subscriptions) {
      const [topicName, partitionId] = subscriptionKey.split(':');
      await this.unsubscribe(topicName, parseInt(partitionId));
    }
  }

  /**
   * Catches up on messages from a specific offset
   * @private
   */
  async _catchUp(topicName, partitionId, startOffset) {
    const currentOffset = await this.service.getOffset(topicName, partitionId);
    
    if (currentOffset > startOffset) {
      const messages = await this.service.getMessages(topicName, partitionId, startOffset);
      
      for (const message of messages) {
        const subscriptionKey = `${topicName}:${partitionId}`;
        const lastOffset = this.currentOffset.get(subscriptionKey) || 0;
        
        // Only deliver if message offset >= current tracked offset (allows re-delivery on seek)
        if (message.offset >= lastOffset) {
          // Await onMessage to ensure sequential processing and proper error handling
          // Errors in onMessage will be handled internally (offset won't be committed)
          try {
            await this.onMessage(message);
          } catch (error) {
            // Error already logged in onMessage, continue with next message
            // Offset was not committed, so message can be retried later
          }
        }
      }
    }
  }

  /**
   * Handles a message received from a topic
   * Queues messages and processes them in offset order to ensure ordering
   * Offset is only committed AFTER successful message processing
   * @param {Object} message - Message object with metadata
   */
  async onMessage(message) {
    const subscriptionKey = `${message.topic}:${message.partition}`;
    
    if (!this.subscriptions.has(subscriptionKey)) {
      return;
    }

    // Initialize queue for this partition
    if (!this.messageQueues.has(subscriptionKey)) {
      this.messageQueues.set(subscriptionKey, new Map());
    }
    const queue = this.messageQueues.get(subscriptionKey);

    // Per-partition lock ensures sequential processing
    const lockKey = `${this.id}:${subscriptionKey}`;
    
    await this.partitionLocks.execute(lockKey, async () => {
      const currentOffset = this.currentOffset.get(subscriptionKey) || 0;
      
      // Skip already processed messages
      if (message.offset < currentOffset) {
        return;
      }

      // Add to queue
      queue.set(message.offset, message);

      // Process messages in order
      await this._processQueue(subscriptionKey);
    });
  }

  /**
   * Processes queued messages in offset order
   * @private
   */
  async _processQueue(subscriptionKey) {
    const queue = this.messageQueues.get(subscriptionKey);
    if (!queue || queue.size === 0) {
      return;
    }

    let expectedOffset = this.currentOffset.get(subscriptionKey) || 0;

    // Process messages in order
    while (queue.has(expectedOffset)) {
      const message = queue.get(expectedOffset);

      // Process message first
      if (this.messageHandler) {
        try {
          const result = this.messageHandler(message);
          if (result instanceof Promise) {
            await result;
          }
        } catch (error) {
          // Processing failed - keep message in queue for retry later
          console.error(`Error processing message ${message.id}:`, error);
          return; // Stop processing, message stays in queue
        }
      }

      // Only commit offset and remove from queue after successful processing
      queue.delete(expectedOffset);
      this.currentOffset.set(subscriptionKey, message.offset + 1);
      this.consumedCount++;
      expectedOffset = message.offset + 1;
    }
  }

  /**
   * Manually seeks to a specific offset in a partition
   * @param {string} topicName - Name of the topic
   * @param {number} partitionId - Partition ID
   * @param {number} offset - Offset to seek to
   */
  async seek(topicName, partitionId, offset) {
    const subscriptionKey = `${topicName}:${partitionId}`;
    
    if (!this.subscriptions.has(subscriptionKey)) {
      throw new Error(`Not subscribed to ${subscriptionKey}`);
    }

    this.currentOffset.set(subscriptionKey, offset);
    
    // Consume messages from the new offset
    await this._catchUp(topicName, partitionId, offset);
  }

  /**
   * Gets the current offset for a subscription
   * @param {string} topicName - Name of the topic
   * @param {number} partitionId - Partition ID
   * @returns {number} - Current offset
   */
  getOffset(topicName, partitionId) {
    const subscriptionKey = `${topicName}:${partitionId}`;
    return this.currentOffset.get(subscriptionKey) || 0;
  }

  /**
   * Gets statistics about this consumer
   * @returns {Object} - Consumer statistics
   */
  getStats() {
    return {
      consumerId: this.id,
      consumerGroupId: this.consumerGroupId,
      consumedCount: this.consumedCount,
      subscriptions: Array.from(this.subscriptions),
      offsets: Object.fromEntries(this.currentOffset)
    };
  }
}

module.exports = Consumer;
