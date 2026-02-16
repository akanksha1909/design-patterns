const Observable = require('./utils/Observable');

/**
 * Topic - Represents a message topic with partitions
 * Encapsulates topic state including partitions, messages, and consumer subscriptions
 * Uses Observer Pattern to notify consumers when messages are published
 */
class Topic extends Observable {
  /**
   * @param {string} name - Name of the topic
   * @param {number} numPartitions - Number of partitions
   */
  constructor(name, numPartitions = 1) {
    super();
    this.name = name;
    this.numPartitions = numPartitions;
    
    // Map<partitionId, Message[]>
    this.partitions = new Map();
    
    // Map<partitionId, Set<Consumer>>
    this.consumers = new Map();
    
    // Initialize partitions
    for (let i = 0; i < numPartitions; i++) {
      this.partitions.set(i, []);
      this.consumers.set(i, new Set());
    }
  }

  /**
   * Publishes a message to a specific partition
   * @param {number} partitionId - Partition ID
   * @param {any} messageData - Message data
   * @returns {Object} - Message with metadata including offset
   */
  publish(partitionId, messageData) {
    if (!this.partitions.has(partitionId)) {
      throw new Error(`Partition ${partitionId} does not exist in topic ${this.name}`);
    }

    const partition = this.partitions.get(partitionId);
    const offset = partition.length;
    
    const message = {
      id: `${this.name}:${partitionId}:${offset}`,
      topic: this.name,
      partition: partitionId,
      offset,
      timestamp: Date.now(),
      data: messageData
    };

    partition.push(message);
    
    // Notify all consumers subscribed to this partition using Observer Pattern
    // Consumers are listening as observers, so they receive messages automatically
    const partitionConsumers = this.consumers.get(partitionId);
    partitionConsumers.forEach(consumer => {
      // Notify consumer via Observer Pattern - consumer is listening for messages
      // Event type format: "message:partitionId:consumerId" ensures each consumer gets their own events
      this.notifyAsync(`message:${partitionId}:${consumer.id}`, message);
    });
    
    return message;
  }

  /**
   * Adds a subscriber (consumer) to a partition
   * Consumer subscribes as an observer to receive messages automatically
   * @param {Consumer} consumer - Consumer instance
   * @param {number} partitionId - Partition ID
   */
  addSubscriber(consumer, partitionId) {
    if (!this.partitions.has(partitionId)) {
      throw new Error(`Partition ${partitionId} does not exist in topic ${this.name}`);
    }

    const partitionConsumers = this.consumers.get(partitionId);
    partitionConsumers.add(consumer);
    
    // Consumer subscribes as observer to listen for messages on this partition
    // When a message is published, Topic will notify this consumer automatically via Observer Pattern
    // Each consumer listens to their own event: "message:partitionId:consumerId"
    // We bind consumer.onMessage() method - cleaner OOP design than anonymous callbacks
    const eventType = `message:${partitionId}:${consumer.id}`;
    // Using method binding: consumer.onMessage.bind(consumer) instead of (msg) => consumer.onMessage(msg)
    this.subscribe(eventType, consumer.onMessage.bind(consumer));
  }

  /**
   * Removes a subscriber (consumer) from a partition
   * @param {Consumer} consumer - Consumer instance
   * @param {number} partitionId - Partition ID
   */
  removeSubscriber(consumer, partitionId) {
    if (!this.consumers.has(partitionId)) {
      return;
    }

    const partitionConsumers = this.consumers.get(partitionId);
    partitionConsumers.delete(consumer);
    
    // Unsubscribe consumer from Observer Pattern events
    const eventType = `message:${partitionId}:${consumer.id}`;
    this.removeAllObservers(eventType);
  }

  /**
   * Gets messages from a partition starting from a specific offset
   * @param {number} partitionId - Partition ID
   * @param {number} offset - Starting offset
   * @param {number} limit - Maximum number of messages to retrieve
   * @returns {Array} - Array of messages
   */
  getMessages(partitionId, offset = 0, limit = 100) {
    if (!this.partitions.has(partitionId)) {
      throw new Error(`Partition ${partitionId} does not exist in topic ${this.name}`);
    }

    const partition = this.partitions.get(partitionId);
    return partition.slice(offset, offset + limit);
  }

  /**
   * Gets the current offset (number of messages) in a partition
   * @param {number} partitionId - Partition ID
   * @returns {number} - Current offset
   */
  getOffset(partitionId) {
    if (!this.partitions.has(partitionId)) {
      throw new Error(`Partition ${partitionId} does not exist in topic ${this.name}`);
    }

    return this.partitions.get(partitionId).length;
  }

  /**
   * Gets information about the topic
   * @returns {Object} - Topic information
   */
  getInfo() {
    const info = {
      topicName: this.name,
      numPartitions: this.numPartitions,
      partitions: []
    };

    for (const [partitionId, messages] of this.partitions.entries()) {
      const partitionConsumers = this.consumers.get(partitionId);
      info.partitions.push({
        partitionId,
        messageCount: messages.length,
        consumerCount: partitionConsumers.size
      });
    }

    return info;
  }

  /**
   * Checks if a partition exists
   * @param {number} partitionId - Partition ID
   * @returns {boolean} - True if partition exists
   */
  hasPartition(partitionId) {
    return this.partitions.has(partitionId);
  }
}

module.exports = Topic;
