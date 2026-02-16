const Observable = require('./utils/Observable');
const AsyncLock = require('./utils/AsyncLock');
const Topic = require('./Topic');

/**
 * MessageStreamService - In-memory message streaming service
 * Supports multiple topics, partitions, producers, and consumers
 * Ensures message ordering within partitions and thread safety
 * Uses Observer Pattern for event notifications
 */
class MessageStreamService extends Observable {
  constructor() {
    super();
    // Map<topicName, Topic>
    this.topics = new Map();
    // Lock for thread-safe operations
    this.lock = new AsyncLock();
  }

  /**
   * Creates a new topic with specified number of partitions
   * @param {string} topicName - Name of the topic
   * @param {number} numPartitions - Number of partitions (default: 1)
   */
  async createTopic(topicName, numPartitions = 1) {
    return this.lock.execute(`topic:${topicName}`, async () => {
      if (this.topics.has(topicName)) {
        throw new Error(`Topic ${topicName} already exists`);
      }

      const topic = new Topic(topicName, numPartitions);
      this.topics.set(topicName, topic);

      this.notify('topic:created', { topicName, numPartitions });
      return { topicName, numPartitions };
    });
  }

  /**
   * Publishes a message to a specific topic and partition
   * @param {string} topicName - Name of the topic
   * @param {number} partitionId - Partition ID
   * @param {any} message - Message to publish
   * @returns {Promise<number>} - Offset of the published message
   */
  async publish(topicName, partitionId, message) {
    return this.lock.execute(`publish:${topicName}:${partitionId}`, async () => {
      const topic = this.topics.get(topicName);
      if (!topic) {
        throw new Error(`Topic ${topicName} does not exist`);
      }

      // Publish message to topic
      // Topic will automatically notify all subscribed consumers via Observer Pattern
      // Consumers are listening as observers, so they receive messages automatically
      const messageWithMetadata = topic.publish(partitionId, message);

      this.notify('message:published', messageWithMetadata);
      return messageWithMetadata.offset;
    });
  }

  /**
   * Subscribes a consumer to a topic and partition OR subscribes an observer to an event
   * Overrides Observable.subscribe to handle both use cases
   * @param {string} topicNameOrEventType - Name of the topic OR event type
   * @param {number|Function} partitionIdOrObserver - Partition ID OR observer function
   * @param {Consumer} consumer - Consumer instance (only for topic subscription)
   * @returns {Function|Promise} - Unsubscribe function (for observer) or Promise (for consumer subscription)
   */
  subscribe(topicNameOrEventType, partitionIdOrObserver, consumer = null) {
    // If second argument is a function and no third argument, it's an observer subscription
    if (typeof partitionIdOrObserver === 'function' && consumer === null) {
      return super.subscribe(topicNameOrEventType, partitionIdOrObserver);
    }
    
    // Otherwise, it's a consumer subscription (async operation)
    const topicName = topicNameOrEventType;
    const partitionId = partitionIdOrObserver;
    
    // Return a promise for the async consumer subscription
    return this._subscribeConsumer(topicName, partitionId, consumer);
  }

  /**
   * Internal method to subscribe a consumer to a topic and partition
   * @private
   */
  async _subscribeConsumer(topicName, partitionId, consumer) {
    return this.lock.execute(`subscribe:${topicName}:${partitionId}`, async () => {
      const topic = this.topics.get(topicName);
      if (!topic) {
        throw new Error(`Topic ${topicName} does not exist`);
      }

      if (!topic.hasPartition(partitionId)) {
        throw new Error(`Partition ${partitionId} does not exist in topic ${topicName}`);
      }

      // Add subscriber to topic partition
      topic.addSubscriber(consumer, partitionId);

      this.notify('consumer:subscribed', { topicName, partitionId, consumerId: consumer.id });
    });
  }

  /**
   * Unsubscribes a consumer from a topic and partition
   * @param {string} topicName - Name of the topic
   * @param {number} partitionId - Partition ID
   * @param {Consumer} consumer - Consumer instance
   */
  async unsubscribe(topicName, partitionId, consumer) {
    return this.lock.execute(`unsubscribe:${topicName}:${partitionId}`, async () => {
      const topic = this.topics.get(topicName);
      if (!topic) {
        return;
      }

      topic.removeSubscriber(consumer, partitionId);

      this.notify('consumer:unsubscribed', { topicName, partitionId, consumerId: consumer.id });
    });
  }

  /**
   * Gets messages from a partition starting from a specific offset
   * @param {string} topicName - Name of the topic
   * @param {number} partitionId - Partition ID
   * @param {number} offset - Starting offset
   * @param {number} limit - Maximum number of messages to retrieve
   * @returns {Promise<Array>} - Array of messages
   */
  async getMessages(topicName, partitionId, offset = 0, limit = 100) {
    return this.lock.execute(`read:${topicName}:${partitionId}`, async () => {
      const topic = this.topics.get(topicName);
      if (!topic) {
        throw new Error(`Topic ${topicName} does not exist`);
      }

      return topic.getMessages(partitionId, offset, limit);
    });
  }

  /**
   * Gets the current offset (number of messages) in a partition
   * @param {string} topicName - Name of the topic
   * @param {number} partitionId - Partition ID
   * @returns {Promise<number>} - Current offset
   */
  async getOffset(topicName, partitionId) {
    return this.lock.execute(`offset:${topicName}:${partitionId}`, async () => {
      const topic = this.topics.get(topicName);
      if (!topic) {
        throw new Error(`Topic ${topicName} does not exist`);
      }

      return topic.getOffset(partitionId);
    });
  }

  /**
   * Gets information about a topic
   * @param {string} topicName - Name of the topic
   * @returns {Promise<Object>} - Topic information
   */
  async getTopicInfo(topicName) {
    return this.lock.execute(`info:${topicName}`, async () => {
      const topic = this.topics.get(topicName);
      if (!topic) {
        throw new Error(`Topic ${topicName} does not exist`);
      }

      return topic.getInfo();
    });
  }
}

module.exports = MessageStreamService;
